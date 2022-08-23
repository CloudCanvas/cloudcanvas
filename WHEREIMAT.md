# JUST DONE

Get default region for resources and set it DONE
Split out to select org before accounts in modal and disable ones not authenticated with an authenticate link DONE
Cloud Canvas website DONE

# Context

Moving MainCanvas to the storyboard so we have an easy place to experiment on the scroll front.
I need to play with selected locking the pan so we can scroll the container.

First though need to try e.stopPropogation on the BaseComponent.

Then also swap out the one in the electron app with the component inside the MainCanvasWrapper and wire it all up.

# TODO

Scroll inner items (sorted just going to try use callback instead of useEffect) DONE
Make sure scale is passed in on load after initial zooom out DONE

Fix copy and paste and delete DONE
no existiing account session error DONE (wasn't saving the client)
Save last position and return on load
Get s3o lambda component done

Looks like the saving of sessions after load is getting overwritten when the app is reloaded

Initial launch didn't have the scale passed in properly

Launch a terminal (disabled if not authenticated)
Launch browser (disabled if not authenticated)

Wizard on landing

Edit a component's props
