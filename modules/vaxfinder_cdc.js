const fetch = require('node-fetch');
const { Headers } = require('node-fetch');

/* Vaxfinder CDC is a script designed to get vaccine provider information from the CDC / Castlight Health API at api.us.castlighthealth.com.
 * The CDC's new user-facing site vaccinefinder.org uses this.
 * The API is open, although not publicly documented at this time. It doesn't like it if you're brazenly accessing it programmatically.
 * Be nice and send headers. There some below that seem to work well.
 * 
 * The CDC'sreturned list of providers is ordered by least distance from a lat/lon origin and is capped at 50 items.
 * It also doesn't currently discriminate based on state boundaries. So.. if your hoping to find as many Missouri
 * providers as possible, consider a point of origin and search radius that won't overflow into another state. 
 * 
 * Main function: get_providers()
 * parameters: location = {address1: "", address2: "", city: "", state: "", zip: ""}, search_radius = Number (in miles)
 * returns: an array of CDC provided data formatted for submission to the vaxbot api
 * 
 */

async function format_data(batch) {
    
    function parse_availability(inventory){
        for(let item of inventory) {
            if (item.in_stock == "TRUE") {
                return true
            }
        }
        return false
    }
    
    
    function parse_vaccine_tags(inventory) {
        let tags = [];
        for(let item of inventory) {
            if(item.in_stock == "TRUE") {
                tags.push(item.name.replace(/COVID Vaccine/, "").trim())
                if (item.supply_level == "LOW_SUPPLY" || item.supply_level == "NO_SUPPLY") {
                    tags.push("Restricted/Limited Supply");
                }    
            }
        }
        return tags
    }
    
    function parse_tags(provider) {
        let tags = [];
        if(provider.accepts_walk_ins) {
            tags.push("walk-ins");
        }
        return tags
    }
    
    let data = batch.map(provider => {
        return {
            name: provider.name,
            source_id: provider.guid,
            source_updated: provider.last_updated || null,
            source_url: "https://vaccinefinder.org/",
            source_name: "CDC Vaccine Finder",
            address1: provider.address1,
            address2: provider.address2 || null,
            city: provider.city,
            state: provider.state,
            zip: provider.zip,
            lat: provider.lat,
            lon: provider.long,
            tags: parse_tags(provider),
            contact_url: provider.prescreening_site || provider.website,
            vaccine_available: parse_availability(provider.inventory),
            vaccine_tags: parse_vaccine_tags(provider.inventory),
        }
    });
    
    return data;
}

async function get_providers (location, search_radius=25) {
    // We need to get these before we can make our main request
    let search_coords;
    let vaccine_ids_string;
    let vaccine_names_string;
    let providers;
    let providers_detailed = [];
    
    // They dont like it if we look like a robot...
    const headers = new Headers({
            "Host": "api.us.castlighthealth.com",
            "Connection": "keep-alive",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache",
            "User-Agent": "Mozilla/5.0 (X11; Linux armv7l) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.197 Safari/537.36",
            "DNT": "1",
            "Accept": "*/*",
            "Referer": "https://api.us.castlighthealth.com/vaccine-finder/v1/medications",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
    });
    
    // Get a coordinate pair from US Census Geocoder for address
    try{
        console.log("Pinging US Census Bureau...")
        const coordinates = await fetch(encodeURI(
            `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=${location.address1},${location.address2 ? location.address2 : ""},${location.city},${location.state},${location.zip ? location.zip : ""}&benchmark=2020&format=json`))
                .then(async (response) => await response.json())
                .then(json => json.result.addressMatches[0].coordinates)
                
        search_coords = coordinates;        
        console.log(`SUCCESS. Retrieved coordinates: ${coordinates}`)
    } catch(err) {
        console.log(`ERROR: failed to get coordinates from geocoder \n ${err}`);
    }
    
    // Get a list of vaccine id's from CDC vaccine finder
    try{
        console.log("Pinging CDC 1...");
        const url = `https://api.us.castlighthealth.com/vaccine-finder/v1/medications`;
        const vaccines = await fetch(url, { method: 'GET', headers: headers})
            .then(async (response) => await response.json())
                
        vaccine_ids_string = vaccines.map(vaccine => vaccine.guid).join();
        vaccine_names_string = vaccines.map(vaccine => vaccine.name).join(", ");
    
        console.log(`SUCCESS. Retrieved guid for the following: ${vaccine_names_string}`);
    } catch(err) {
        console.log(`ERROR: failed to get vaccine IDs from CDC \n ${err}`);
    }
    
    // Get a list of providers for those vaccines and remove ones out-of-state. also remove walmarts.
    try{
        console.log("Pinging CDC 2...");
        const url = `https://api.us.castlighthealth.com/vaccine-finder/v1/provider-locations/search?medicationGuids=${vaccine_ids_string}&lat=${search_coords.y}&long=${search_coords.x}&radius=${search_radius}`;
        providers = await fetch(url, { method: 'GET', headers: headers})
            .then(async (response) => await response.json())
            .then(json => json.providers.filter(provider => provider.state == location.state && !provider.name.toLowerCase().includes("walmart")))
            //~ .then(json => json.providers.filter(provider => !provider.name.toLowerCase().includes("walmart")));

        console.log(`SUCCESS. Retrieved ${providers.length} providers located within ${search_radius}m of origin in ${location.state}`)

    } catch(err) {
        console.log(`ERROR: failed to get providers from CDC \n ${err}`);
    }
    
    // Get provider details
    for(let provider of providers) {
        try{
            console.log("Trying to get provider details...");
            const url = `https://api.us.castlighthealth.com/vaccine-finder/v1/provider-locations/${provider.guid}`;
            const detail = await fetch(url, { method: 'GET', headers: headers})
                .then(async (response) => await response.json())
                .then(json => providers_detailed.push(json));

            console.log(`SUCCESS. Retrieved details for provider: ${provider.guid}`)

        } catch(err) {
            console.log(`ERROR: failed to get provider ${provider.guid} from CDC \n ${err}`);
        }
    }
    
    return format_data(providers_detailed);
}

module.exports = get_providers;
