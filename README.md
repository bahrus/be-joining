# be-joining

Similar to [be-joined](https://github.com/bahrus/be-joined) and [be-calculating](https://github.com/bahrus/be-calculating).

Works in conjunction with [xp-as](https://github.com/bahrus/xp-as).

```html
<tr xp-as-a-from=aria-rowindex aria-rowindex=11>
    <td itemprop=myProp xp-as-b-from=itemprop>
        <input type=radio-button be-joining
            name-be-joining="hello-{a}-goodbye-{b}"
        >
    </td>
</tr>
```

renders:

```html
<tr xp-as-a-from=aria-rowindex aria-rowindex=11>
    <td itemprop=myProp xp-as-b-from=itemprop>
        <input type=radio-button be-joining
            name-be-joining="hello-{a}-goodbye-{b}"
            name=hello-11-goodbye-myProp
        >
    </td>
</tr>
```
