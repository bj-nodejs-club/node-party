"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
const React = require('react');
const DetailsComp = (details) => {
    return React.createElement("div", {className: "email-details", style: { fontSize: 'small', opacity: 0.7 }}, React.createElement("ul", null, React.createElement("li", null, "From: ", details.from), React.createElement("li", null, "To:   ", details.to), React.createElement("li", null, "Data: ", details.date5)));
};
class EmailItemComponent extends React.Component {
    render() {
        return React.createElement("div", {className: "email-item", style: { height: 67 }}, React.createElement("h1", null, this.props.title), React.createElement(DetailsComp, __assign({}, this.props.details)), React.createElement("div", {className: "email-body"}, this.props.body));
    }
}
exports.EmailItemComponent = EmailItemComponent;
