# be-joining (🥂) [WIP]

Derive attribute values of a DOM element by interpolating attributes of ancestor elements

## Why

Support for rendering loops of HTML is a core functionality of most web frameworks.  Reliance on this feature accounts for some of the "framework lock-in" that is saddling the web's promise of open standard interoperability. I.e. the intracies of looping makes it difficult to achieve interoperability between different frameworks, so that they can work in harmony together at the granular level.

Some of the complexities of looping that makes this "barrier to entry" significant is how to reconcile server-side rendering with client-side, passing properties, re-rendering efficiently, and also creating dynamic attribute markers when needed that depend on other attributes.  The ability to break down this suite of requirements into a set of standalone features that can be "outsourced" to competing libraries would reduce the interoperability "bottleneck" that looping requirements tend to impose.

This package focuses on the last listed requirement -- creating dynamic attribute markers when needed. 

Similar to [be-joined](https://github.com/bahrus/be-joined) and [be-calculating](https://github.com/bahrus/be-calculating).

Works in conjunction with [xp-as](https://github.com/bahrus/xp-as).

```html
<tr xp-as-a=aria-rowindex aria-rowindex=11>
    <td itemprop=myProp xp-as-b=itemprop>
        <input type=radio-button be-joining
            be-joining-name="hello-{a}-goodbye-{b}"
        >
    </td>
</tr>
```

renders:

```html
<tr xp-as-a-from=aria-rowindex aria-rowindex=11>
    <td itemprop=myProp xp-as-b=itemprop>
        <input type=radio-button be-joining
            be-joining-name="hello-{a}-goodbye-{b}"
            name=hello-11-goodbye-myProp
        >
    </td>
</tr>
```

## Shortcuts 

```html
<tr 📎-a=aria-rowindex aria-rowindex=11>
    <td itemprop=myProp 📎-b=itemprop>
        <input type=radio-button 🥂=📎
            🥂-name="hello-{a}-goodbye-{b}"
        >
    </td>
</tr>
```
