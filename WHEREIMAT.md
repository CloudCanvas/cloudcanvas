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

We're reaching the point where because the AWS client is passed in we need to mock the data to storyboard properly and that's a pain in the ass.

We should probably pass in an awsClient and a dataFetcher and default the data fetcher or something?

I think we're probably going to have to switch around how we do this and use children inistead

This should be done in the app;

const awsAccessClient = useMemo(
() =>  
awsClientN
.account(c.config.accountId!)
.region(c.config.region! as any)
.role(c.config.permissionSet!),
[c.config.accountId, c.config.region, c.config.permissionSet]
);

# Notes

Component re-architecture is done. Now don't need to really do anything to have it render apart from integarte into addResource -> can thiink about how to model this later.

# DONE

Get s3o lambda component done (DONE)
Entries descending by default and at the top? DONE
Wizard on landing DONE
Expiry need to tick over without a refresh - DONE
Clicking onSelect on inspector should not toggfle it should just set selected - DONE
Lambda component needs to have a max limit with ellipsis - DONE
Title on minimal component menu to show org - not part of the component options. - DONE

# Notes

It definitely feels nice but there's a few small user experience things to solve.

#1 In particular for lambda logs, the updates jump in batches and you lose track. I think even if 100 updates come in they should appear staggered
over time and "pop" in.

#2 Each initial entry should be the same size so we need to ellipsis the text and have it expandable.

#3 Really need those split screen controls or some way to f

## TODO

Auto scroll is affecting parent window. Ahhhhhhh mother fucker. - Just use a scrollTo position
Auto update

## Next release

Launch browser (disabled if not authenticated)
Launch a terminal (disabled if not authenticated)
Edit a component's props

Sometimes you have to build something to see if it works.

The first iteration of Cloud Canvas has a few flaws I learned as I've used.

I have a redesign I feel addresses these but I'll releaser what I have and see if the users have the same issues.

# TODO

Finish up LogEntry
Web3 jobs
Sensive AppSync issue
