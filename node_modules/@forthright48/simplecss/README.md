# SimpleCSS

A simple minimalistic CSS framework that uses flexbox grid.

Please, do not expect anything from the framework, cause I am not sure what I am doing.

## Normalize.css

First of all, include normalize.css file from src in the project to normalize browser behavior. Refer to [Normalize.css](https://necolas.github.io/normalize.css/) for more details.

## Row, Column, Tower and Container

The whole flexbox system depends on the following four classes: `container, tower, row, col`.

'container' is a vertical flex-container. Originally it was a class to determine the width of the site, but later turned into flex only for one reason: sticky footer. The container should be used to create stick-footer only. It should appear right after body tag only and no where else.

In case we need vertical flex-container, we can use `tower`. It is a flex-container and if nested in another container will also act as flex item.

`row` is a horizontal flex-container, which can act as a container if nested.

`item` is flex-item only.

## `one`, `two`, `three` ... `twelve` and `any`

The literal numbers `one`, `two` and such forms the basis of the flex items. `any` means there is no fixed basis, it will dynamically allocate the basis like a normal flexbox.

## Sticky Footer
Based on the article [Sticky Footer](https://philipwalton.github.io/solved-by-flexbox/demos/sticky-footer/), the following will create sticky footer:

```
<div class="container">

  <header class="row">
  </header>

  <main class="u-flex">
  </main>

  <footer class="row">
  </footer>

</div>
```

Note the `u-flex` class on main tag. That class forces the main tag to use up all the empty space around, thus pushing the footer to bottom.
