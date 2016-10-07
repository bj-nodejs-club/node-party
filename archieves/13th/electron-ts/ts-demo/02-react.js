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
const ReactDOM = require('react-dom');
const _02_email_1 = require('./02-email');
/**   aaaa */
class MailboxComponent extends React.Component {
    render() {
        return React.createElement("div", null, this.props.emails.forEach(mail => React.createElement(_02_email_1.EmailItemComponent, __assign({}, mail))));
    }
}
var emails = [
    {
        title: 'Hi there',
        body: `Hello, I'm zc. How are you going?`,
        details: {
            from: 'zc@me.com',
            to: 'root@moon.com',
            date5: '2046-12-34 12:00'
        }
    }
];
ReactDOM.render(React.createElement(MailboxComponent, {emails: emails}), document.getElementById('inbox'));
