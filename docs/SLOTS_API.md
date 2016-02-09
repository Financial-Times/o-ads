# Slots Functions
- `clear`
- `collapse`
- `destroy`
- `initSlot`
- `refresh`
- `uncollapse`

### `oAds.slots#clear(slot)`
Takes an array of slot names or a slot name and clears those slots/slot. If no argument is passed it will invoke the function on all slots it has reference to.

Parameter | Description
--------- | --------------------------------
slot      | slot name or array of slot names

### `oAds.slots#collapse(slot)`
Takes an array of slot names or a slot name and collapses those slots/slot. If no argument is passed it will invoke the function on all slots it has reference to.

Parameter | Description
--------- | --------------------------------
slot      | slot name or array of slot names

### `oAds.slots#destroy(slot)`
Takes an array of slot names or a slot name and destroys those slots/slot and remove any reference of them. If no argument is passed it will invoke the function on all slots it has reference to.

Parameter | Description
--------- | --------------------------------
slot      | slot name or array of slot names

### `oAds.slots#initSlot(container)`
Confirms an ad container exists in the page and creates a Slot object.

Parameter | Description
--------- | ----------------------------------------------------------------------------------------------------------------------
container | html element where Ad Slot is to be created. Can be passed a string of the `data-o-ads-name` attribute on the element.

### `oAds.slots#refresh(slot)`
Takes an array of slot names or a slot name and refreshes those slots/slot. If no argument is passed it will invoke the function on all slots it has reference to.

Parameter | Description
--------- | --------------------------------
slot      | slot name or array of slot names

### `oAds.slots#uncollapse(slot)`
Takes an array of slot names or a slot name and uncollapses those slots/slot. If no argument is passed it will invoke the function on all slots it has reference to.

Parameter | Description
--------- | --------------------------------
slot      | slot name or array of slot names
