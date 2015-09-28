/*! Tabby v9.0.0 | (c) 2015 Chris Ferdinandi | MIT License | http://github.com/cferdinandi/tabby */
!function(t,e){"function"==typeof define&&define.amd?define([],e(t)):"object"==typeof exports?module.exports=e(t):t.tabby=e(t)}("undefined"!=typeof global?global:this.window||this.global,function(t){"use strict";var e,n={},o="querySelector"in document&&"addEventListener"in t&&"classList"in document.createElement("_"),a={selector:"[data-tab]",toggleActiveClass:"active",contentActiveClass:"active",initClass:"js-tabby",callback:function(){}},r=function(t,e,n){if("[object Object]"===Object.prototype.toString.call(t))for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&e.call(n,t[o],o,t);else for(var a=0,r=t.length;r>a;a++)e.call(n,t[a],a,t)},s=function(){var t={},e=!1,n=0,o=arguments.length;"[object Boolean]"===Object.prototype.toString.call(arguments[0])&&(e=arguments[0],n++);for(var a=function(n){for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e&&"[object Object]"===Object.prototype.toString.call(n[o])?t[o]=s(!0,t[o],n[o]):t[o]=n[o])};o>n;n++){var r=arguments[n];a(r)}return t},c=function(t,e){var n,o,a=e.charAt(0);for("["===a&&(e=e.substr(1,e.length-2),n=e.split("="),n.length>1&&(o=!0,n[1]=n[1].replace(/"/g,"").replace(/'/g,"")));t&&t!==document;t=t.parentNode){if("."===a&&t.classList.contains(e.substr(1)))return t;if("#"===a&&t.id===e.substr(1))return t;if("["===a&&t.hasAttribute(n[0])){if(!o)return t;if(t.getAttribute(n[0])===n[1])return t}if(t.tagName.toLowerCase()===e)return t}return null},i=function(t){for(var e=[],n=t.parentNode.firstChild;n;n=n.nextSibling)1===n.nodeType&&n!==t&&e.push(n);return e},l=function(t,e){if(!t.classList.contains(e)){var n=t.querySelector("iframe"),o=t.querySelector("video");if(n){var a=n.src;n.src=a}o&&o.pause()}},u=function(t,e,n){var o="li"===t.parentNode.tagName.toLowerCase()?!0:!1,a=i(o?t.parentNode:t),s=i(e);r(a,function(t){t.classList.remove(n.toggleActiveClass),o&&t.querySelector(n.selector).classList.remove(n.toggleActiveClass)}),r(s,function(t){t.classList.contains(n.contentActiveClass)&&(l(t),t.classList.remove(n.contentActiveClass))})},f=function(t,e,n){var o=t.parentNode;t.classList.add(n.toggleActiveClass),o&&"li"===o.tagName.toLowerCase()&&o.classList.add(n.toggleActiveClass),r(e,function(t){t.classList.add(n.contentActiveClass)})};n.toggleTab=function(t,e,n,o){var r=s(r||a,n||{}),c=document.querySelectorAll(e);u(t,c[0],r),f(t,c,r),r.callback(t,e)};var d=function(t){var o=c(t.target,e.selector);o&&(t.preventDefault(),n.toggleTab(o,o.getAttribute("data-tab"),e))};return n.destroy=function(){e&&(document.documentElement.classList.remove(e.initClass),document.removeEventListener("click",d,!1),e=null)},n.init=function(t){o&&(n.destroy(),e=s(a,t||{}),document.documentElement.classList.add(e.initClass),document.addEventListener("click",d,!1))},n});
