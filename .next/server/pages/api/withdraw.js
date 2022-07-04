"use strict";
(() => {
var exports = {};
exports.id = 486;
exports.ids = [486];
exports.modules = {

/***/ 2792:
/***/ ((module) => {

module.exports = require("@ethersproject/contracts");

/***/ }),

/***/ 3138:
/***/ ((module) => {

module.exports = require("@ethersproject/units");

/***/ }),

/***/ 9197:
/***/ ((module) => {

module.exports = require("circomlibjs");

/***/ }),

/***/ 614:
/***/ ((module) => {

module.exports = require("defender-relay-client/lib/ethers");

/***/ }),

/***/ 1982:
/***/ ((module) => {

module.exports = require("ethers");

/***/ }),

/***/ 4558:
/***/ ((module) => {

module.exports = require("next/config");

/***/ }),

/***/ 2267:
/***/ ((module) => {

module.exports = require("snarkjs");

/***/ }),

/***/ 1017:
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ 8445:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ethersproject_contracts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2792);
/* harmony import */ var _ethersproject_contracts__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_ethersproject_contracts__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _contracts_Pool_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(891);
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(390);



const { DefenderRelaySigner , DefenderRelayProvider ,  } = __webpack_require__(614);
const credentials = {
    apiKey: process.env.DEFENDER_API_KEY,
    apiSecret: process.env.DEFENDER_SECRET_KEY
};
const provider = new DefenderRelayProvider(credentials);
const signer = new DefenderRelaySigner(credentials, provider, {
    speed: "fast",
    validForSeconds: 600
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (async (req, res)=>{
    try {
        const { body: { proof , args  } ,  } = req;
        console.log({
            credentials
        });
        console.log({
            provider
        });
        console.log({
            signer
        });
        const contract = new _ethersproject_contracts__WEBPACK_IMPORTED_MODULE_0__.Contract((0,_util__WEBPACK_IMPORTED_MODULE_2__/* .getAddress */ .Kn)(), _contracts_Pool_json__WEBPACK_IMPORTED_MODULE_1__, signer);
        console.log(...[
            ...args.slice(2, 7)
        ], args[0]);
        console.log({
            proof
        });
        console.log({
            contract
        });
        const tx = await contract.withdraw(proof, ...[
            ...args.slice(2, 7),
            args[0]
        ], {});
        console.log({
            tx
        });
        const txReciept = await tx.wait();
        console.log({
            txReciept
        });
        res.json(txReciept);
    } catch (err) {
        console.log({
            err
        });
        res.json(err);
    }
});


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [852], () => (__webpack_exec__(8445)));
module.exports = __webpack_exports__;

})();