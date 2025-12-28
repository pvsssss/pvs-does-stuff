A dictionary is a collection of values that are stored using a key.
Dictionaries and sets alike are not sequence types and hence dont have any indexing.
We use curly braces to contain the dictionary. The key value pairs inside the dictionary are separated by a colon.
Each key in the dictionary has to be unique but the values can be same.

Dictionaries allow any arbitrary value that is not mutable to be used as a key, if we try to use a mutable object like a list or a dictionary as key, it won't work.
Similarly on that same logic, if we try to use a tuple with a list inside, it will throw an error - unhashable type.
## Accessing items in a dictionary
We can get values from a dictionary by providing a key. It works in a similar way as indexing into a list, but instead we use the key instead of the index position.
We have two ways to access the items in a dictionary - one is to provide the key inside squares braces like this ```value = mydict[key]```, the other way is to use the get items method like this```value = mydict.get(key, default value)```.
The main difference between the .get() method and using the key as an index position is that if the key provided in the get method does not exist in the dictionary, it will simply return none whereas in the case of using indexing, it will crash the program with a keyError.
The get method is useful if we are not sure if the key exists or not. If there is a possibility that the key wont be present then call the get method.
But as indexing is faster than the get method, so if you know for sure the key will be in the dictionary then you should use indexing.
## Iterating over a dictionary
When we iterate over a dictionary using a loop then it iterates over the keys inside the dictionary.
Just like lists have an enumerate function to get both the index and the value, dictionaries have a similar method called .items()
It is more efficient to use the items method than indexing over the dictionary for the keys and values.
What you should use - 
```python
for key, value in mydict.items():
	print(key, value, sep=", ")
```
What you shouldn't use - 
```python
for key in mydict():
	print(key, mydict[key])
```

The enumerate function can also be used with a dictionary. Although dictionaries don't have an index value, so the enumerate function creates the indices for us and returns a tuple with an index value and the keys from the dictionary.
## Adding values in dictionary
Dictionaries don't have an append method, instead we assign the values to a dictionary using it's key.
```mydict[key] = value```

Dictionaries preserve the insertion order, i.e. the order in which the values are added in the dictionary will remain same. (If you are using python 3.6 or above, python 3.5 and earlier did not preserve the insertion order preserve the insertion order. Prior to python 3.6 dictionaries were unordered and the enteries appeared in random order.)
## Updating values
To update a value of a specific key, we use the same syntax as adding a new key value pair, but instead of using a new key we use the key whose value we want to change. 
```mydict[keyThatExistsAlready] = newValue```
## Removing values
There are multiple ways to remove items from a dictionary.
One way is to use the del statement like this ==```del mydict[key]```==
While using the del statement if the key provided is not in the dictionary, it will crash the program with a keyError.

Another way of removing items is using the pop method. Now it will still crash if the key is not present in the dictionary but this is deliberate as we can provide a default value to the function that it will return instead of crashing. 
```mydict.pop(key, returnValue)```
This return value can be anything - a str, int, list or even None.
Note that the default return value will only be printed if the key is not found in the dictionary. If the key is present in the dictionary then it will return the value assigned to the key instead.

Del works only slightly better than pop, so until and unless you have a very big dictionary and are performing lots of deletions, you won't see a big performance difference. So it's alright if you use pop instead of del in most cases.
## Membership operator in dictionaries
When we use the membership operator in a dictionary we are only checking the keys, and not the values.
This is different from the membership operator in lists, as when we call a membership operator in a list, it checks for the value in that list.

Membership operators are - ```in``` and ```not in``` 
## Setdefault Method
The `setdefault()` method in Python dictionaries is used to retrieve the value associated with a given key. It also provides a way to add a new key-value pair to the dictionary if the key does not already exist.

If the `key` specified in `setdefault(key, default_value)` already exists in the dictionary, the method simply returns the value associated with that `key`. The dictionary remains unchanged.

If the `key` does not exist in the dictionary, `setdefault()` inserts the `key` into the dictionary with the `default_value` provided. It then returns this `default_value`.

syntax - `dict.setdefault(key, default_value)`
If `default_value` is not provided, it defaults to `None`.
## Update Method
 The `update()` method in Python dictionaries is used to add key-value pairs from another dictionary or an iterable of key-value pairs to the target dictionary. This method modifies the dictionary in-place and does not return a new dictionary.

syntax - `dict.update([other])`
where `dict` is the dictionary to be updated and
`other` can be either another dictionary, an iterable of key-value pairs like a list of tuples or keyword arguments.
## Copying a Dictionary 
When you assign two variable to the same dictionary like this - 
```python
d1 = {"one" : 1, "two" : 2, ...}
d2 = d1
```
what it actually does is that both d1 and d2 point to the same object in memory.
This means that changing either d1 or d2 would produce a change in the other. This does not create a *new* dictionary.
### Shallow Copy
To make a copy of a dictionary in memory we can use the .copy() method. This method makes a **shallow** copy of the original dictionary. Any changes made to the copy would not be reflected in the original and vice versa.
Whenever a dictionary key is assigned a mutable value such as list, the list is stored somewhere else in the memory and the reference to that list is passed down to the dictionary key.
So when a shallow copy of the dictionary is made, the same reference is also copied down instead of creating another list in memory. What this means is that both the original and the copied list now a value that point to the same location in memory. So if you were to mutate the object using the original dictionary, it would show the same in the copied one as well because both dictionaries are pointing to the same object.
### Deep Copy
The deep copy method is not available in the standard python library but can be imported from the copy module.
When a deep copy of a dictionary is made, it not only copies all the immutable values but. also creates another separate object in memory if it encounters a mutable value object. 
This way both the original and copied dictionaries have their separate mutable objects in memory.
## Other Dictionary Methods

- list(d) - returns a list of all the keys used in the dictionary 'd'
- len(d) - returns the number of items in the dictionary 'd'
- d\[key] - return the item of 'd' with key 'key'. Raises a keyError if is not in the map
- d\[key] = value - set `d[key]` to 'value'
- del d\[key] - remove `d[key]` from 'd'. Raises keyError if key is not in the map
- key in d - returns True if key is in 'd', else False
- .clear() - removes all items from the dictionary
- .get(key,\[defaultVal]) - returns the value for key, if key is not in dictionary, return defaultVal, if defaultVal is not given, it defaults to None
- .pop(key,\[defaultVal]) - if key is in dictionary, remove it and return it's value, else return defaultVal. If defaultVal is not given and key is not in dictionary, a keyError is raised
- .popitem() - remove and return a (key, value) pair from the dictionary in LIFO order. If the dictionary is empty, it raises a keyError
- dict.fromkeys(seq, value) - returns a dictionary with keys as items from the specified sequence and the specified values. Providing a value is optional and defaults to None. 
- d.values() - returns a list with all the values inside 'd'