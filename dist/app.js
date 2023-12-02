var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import AppRouter from "./routes/router";
function HHTestApp() {
    return (_jsxs("div", __assign({ className: "App" }, { children: [_jsxs("header", { children: [_jsx(Link, __assign({ to: "/console/test1" }, { children: "\uD14C\uC2A4\uD2B81" })), _jsx(Link, __assign({ to: "/console/test2" }, { children: "\uD14C\uC2A4\uD2B82" }))] }), _jsx(AppRouter, {})] })));
}
export default HHTestApp;
