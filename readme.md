Automata tools contains a parser for finite state machines (FSMs).

## The API

Automata tools provides 4 named exports:

- FSM_parser - a class; builds FSM Objects given an array of lines (the code) and a filename.
- traverse - takes an FSM Object and a string; returns the ending state (FSM_node) when the string is run through the state machine.

- StateCircle - a react component for rendering state machines as SVGs
- toSVG - given an FSM, returns an SVG as a string (which is really just a rendered StateCircle).

## The CLI

Automata tools can be installed globally to get access to its CLI - available as alang.

```bash
$ npm i -g automata-tools
```

There is built-in help available.

## Syntax

The syntax for describing a finite state machine is very simple. Below is an example of an FSM:

```fsm
a Machine which accepts even binary numbers (not including the empty string)

=> read odd

read odd:
	0 => read even

(read even):
	1 => read odd
```

Lets go through the key points.

line 3 (`=> read odd`) defines the initial state for the machine - in this case, it is a state called "`read odd`"

`read odd` is defined two lines later, with `read odd:` - this is a state definition, as indicated by the `:` at the end of the line

Immediately below that is a transition definition (`0 => read even`); when the machine reads a 0, it will move to a new state, `read even`.

read even is defined below that, with `(read even):`

The brackets around the state name define this as an accepting state - read odd, which does not have bracket, is a rejecting state.

The first line is a comment - all lines are if they cannot be parsed as either a state definition (ending in `:`) or as a transition definition (containing `=>`).

leading and trailing white space does not matter - the transition definitions are tabbed in for readability. A transition definition applies to the most recently defined state.

Note however that within a state name, whitespace is treated just like any other character, so `hello world` and `hello  world` (with 2 spaces) are not the same.
