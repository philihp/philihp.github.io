---
layout: post
title: Testing a Redux Connected Component with Thunk Actions with Enzyme
date: 2018-10-18 07:31:45.000000000 -07:00
tags:
  - dispatch
  - enzyme
  - jest
  - Programming
  - react
  - redux
  - test
  - thunk
redirect_from:
  - /blog/2018/testing-a-redux-connected-component-with-thunk-actions-with-enzyme/
  - /blog/2018/testing-a-redux-connected-component-with-thunk-actions-with-enzyme.html
---

Let's say you've got a React component connected to a Redux store

```jsx
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { saveColor } from "../actions/save";
import ColorButtons from "../components/ColorButtons";

const ColorButtons = ({ colors, onClick }) => (
  <div>
    {colors.map((color) => {
      <button type="button" key={color} onClick={onClick(color)}>
        {color}
      </button>;
    })}
  </div>
);

ColorButtons.propTypes = {
  colors: PropTypes.arrayOf(PropTypes.string),
  onClick: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  colors: state.colors || [],
});

const mapDispatchToProps = (dispatch) => ({
  onClickColor: (color) => () => {
    dispatch(saveColor({ color }));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ColorButtons);
```

Which calls this action creator.

```jsx
export const SAVE_COLOR = "SAVE_COLOR";
export const saveColor = ({ color }) => ({
  type: SAVE_COLOR,
  color,
});
```

Everything works great in your smoke tests. How do you write unit tests for this? One way would be to expose mapStateToProps and mapDispatchToProps by exporting them (see <a href="https://jsramblings.com/2018/01/15/3-ways-to-test-mapStateToProps-and-mapDispatchToProps.html">jsramblings.com</a>). This is indeed smelly, though <a href="https://github.com/reduxjs/redux/blob/master/docs/recipes/WritingTests.md#connected-components">Redux documentation</a> suggests doing something similar, but this is something I disagree with, because your tests now assume that connect will be called on the exposed internal. What if the signature for connect changes? What if someone makes a change that messes with what's passed to connect()? That's now untested.

---

### Why even test it?

> It is not necessary to test that our mapDispatchToProps is properly passing a function (login, submit, click etc.) to the connected component, because Redux is already responsible for this. [<a href="https://willowtreeapps.com/ideas/best-practices-for-unit-testing-with-a-react-redux-approach">willowtreeapps.com</a>]

I disagree with the above quote. It is true that Redux is responsible for it, and we make an assumption that it will continue to function properly. Tests are meant to outsource the cognitive load of maintaining assumptions after every change and library upgrade. What happens when we upgrade Redux, and they change the signature of connect()?

We have A &rarr; B &rarr; C, and B is private. They suggest exposing B, and testing B &rarr; C, but instead we should have a test that A &rarr; C.

---

I prefer actually rendering the component, and checking to make sure it still connects as expected. This is not an expensive test.

```javascript
import React from "react";
import { shallow } from "enzyme";
import configureStore from "redux-mock-store";
import ColorButtons from "../ColorButtons";
import { saveColor } from "../../actions/save";

const buildStore = configureStore();

describe("ColorButtons", () => {
  let store;
  let wrapper;
  const initialState = { colors: ["red", "blue"] };

  beforeEach(() => {
    store = buildStore(initialState);
    wrapper = shallow(<colorbuttons store="{store}" />);
  });

  it("passes colors from state", () => {
    expect(wrapper.props().colors).toBe(initialState.colors);
  });

  it("can click yellow", () => {
    const color = "yellow";
    wrapper.props().onClick(color)();
    expect(store.getActions()).toContainEqual(saveColor({ color }));
  });
});
```

The first test checks to make sure the array available to wrapper.props() is the same array as that one stored in initialState.colors.

The second test makes sure that the store gets an action dispatched to it. It's not necessary to check to make sure the store digested and reduced the action into the state; you're not testing the reducers here.

### What if the component calls a Thunk action?

This will work for about 20% of your components, but if you ever want to call some async action, you'll probably dispatch a thunk action. That is, some of your actions will instead return functions that take dispatch. From the connected controller, they look the same, but the action looks slightly different. Say our mapDispatchToProps now looks like this contrived example

```javascript
const mapDispatchToProps = (dispatch) => ({
  onClickColor: (color) => () => {
    dispatch((<b>storeColor</b>)({ color }));
  },
});
```

And the actions now look like this

```javascript
export const saveColor = ({ color }) => ({
  type: SAVE_COLOR,
  color,
});

export const <b>storeColor</b> = ({ color }) => <b>dispatch =></b> {
dispatch(saveColor());
return axios.patch('/api/color.json', { color })
.then(response => {
// another dispatched action maybe?
});
```

If you tried to test this as-is, you'd get the error

```
Actions must be plain objects. Use custom middleware for async actions.
  26 |   onClick: color => () => {
> 27 |     dispatch(storeColor({ color }));
     |     ^
  28 |   },
  29 | });
```

### Actions must be plain objects. Use custom middleware for async actions.

This is because your test's mock-store isn't configured with Thunk middleware. Configure it like this:

```javascript
import React from "react";
import { shallow } from "enzyme";
import thunk from "redux-thunk";
import configureStore from "redux-mock-store";
import ColorButtons from "../ColorButtons";
import { saveColor } from "../../actions/save";

const buildStore = configureStore([thunk]);

describe("ColorButtons", () => {
  let store;
  let wrapper;
  const initialState = { colors: ["red", "blue"] };

  beforeEach(() => {
    store = buildStore(initialState);
    wrapper = shallow(<colorbuttons store="{store}" />);
  });

  it("passes colors from state", () => {
    expect(wrapper.props().colors).toBe(initialState.colors);
  });

  it("can click yellow", () => {
    const color = "yellow";
    wrapper.props().onClick(color)();
    expect(store.getActions()).toContainEqual(saveColor({ color }));
  });
});
```

Now your test will dispatch just fine. Ship it!
