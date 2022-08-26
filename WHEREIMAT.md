# JUST DONE

Get default region for resources and set it DONE
Split out to select org before accounts in modal and disable ones not authenticated with an authenticate link DONE
Cloud Canvas website DONE

# Context

Moving MainCanvas to the storyboard so we have an easy place to experiment on the scroll front.
I need to play with selected locking the pan so we can scroll the container.

First though need to try e.stopPropogation on the BaseComponent.

Then also swap out the one in the electron app with the component inside the MainCanvasWrapper and wire it all up.

Scroll inner items (sorted just going to try use callback instead of useEffect) DONE
Make sure scale is passed in on load after initial zooom out DONE

Fix copy and paste and delete DONE
no existiing account session error DONE (wasn't saving the client)

Looks like the saving of sessions after load is getting overwritten when the app is reloaded DONE

Save last position and return on load - we need to actually pass this into the main canvas as it does an auto pan by to center at present - instead we need to load any presets then render and ensure we pass in the location - DONE except for zoom, that will have to be post beta

Need to allow zoom on an element so has to be selected to scrolll DONE - Problem was design of add and remove and also recreating the function inside the useffect so it never got removed as ref was gone

# Currently

## Refactoring the component architecture

We're reaching the point where becausee the AWS client is passed in we need to mock the data to storyboard properly and that's a pain in the ass.

We should probably pass in an awsClient and a dataFetcher and default the data fetcher or something?

I think we're probably going to have to switch around how we do this and use children inistead

This should be done in the app;

const awsAccessClient = useMemo(
() =>  
awsClient
.account(c.config.accountId!)
.region(c.config.region! as any)
.role(c.config.permissionSet!),
[c.config.accountId, c.config.region, c.config.permissionSet]
);

# TODO

Get s3o lambda component done
Launch a terminal (disabled if not authenticated)
Launch browser (disabled if not authenticat ed)
Wizard on landing
Edit a component's props
