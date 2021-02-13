# Hello World!

VaxBot is inspired by the work of Huge Ma and their work on TurboVax for NYC @ https://www.turbovax.info

While TurboVax does a fantstic job of getting people information about available COVID-19 vaccination appointments without having to repeatedly fill out lengthy forms,
it is not open-sourced and is built on top of NYC-centric infrastructure. 

VaxBot is an attempt to take the same idea and create an open sourced template that can be used for any city or state.
At this time, many states don't have aggregator sites where people can go to search for available appointments from multiple providers.
However, many national pharmacy chains provide their own search services. VaxBot is designed to 
expedite the process of frequently checking multiple pharmacy websites, and by focusing on nationwide chains it can provide a solid base of
potential appointments regardless of state or city specific resources. With these built-in, and with an open source codebase, other developers can
focus on customizing VaxBot to include additional regional resources.

## How it Works

VaxBot is designed with a map and crawler approach. The map takes the form of a javascript object and contains:
* a set of designated departure and terminus urls for the crawler
* a list of html elements that need to be manipulated on a given page or provided specified values
* a list of html elements to select when ready to proceed with navigation.

The crawler follows the map et voila!
