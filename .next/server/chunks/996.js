"use strict";
exports.id = 996;
exports.ids = [996];
exports.modules = {

/***/ 8350:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"src":"/_next/static/media/logo.884452c3.png","height":500,"width":500,"blurDataURL":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAtUlEQVR42mMAgSvfPjN+mNTE/KUyieVrZznL5xmdzFc+f2BkIAocY2BgvPL/P+eX7krn70n2s36Vx876O6fb9fr//9y7gXIQK04fK7+9a9P/e9vW/b+3Z8v/W7u3/D95cHcXAwxcOXl40a3lc//fAUkunvn/dUvx/727toaCJf8DjfE7fITvXm6E28coozlf4izn/ku29WCYv5mFgWjQuGY1452yFOaXBZEsr3OCWb5l+zLD5ABjxld10ptGIQAAAABJRU5ErkJggg=="});

/***/ }),

/***/ 9996:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ Nav)
});

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
// EXTERNAL MODULE: external "@chakra-ui/react"
var react_ = __webpack_require__(8930);
// EXTERNAL MODULE: external "@chakra-ui/icons"
var icons_ = __webpack_require__(4513);
// EXTERNAL MODULE: external "@web3-react/core"
var core_ = __webpack_require__(8054);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(6689);
// EXTERNAL MODULE: external "@web3-react/injected-connector"
var injected_connector_ = __webpack_require__(6590);
;// CONCATENATED MODULE: ./connectors.ts

const injected = new injected_connector_.InjectedConnector({
    supportedChainIds: [
        4
    ]
});

;// CONCATENATED MODULE: ./hooks/useEagerConnect.ts



function useEagerConnect() {
    const { activate , active  } = (0,core_.useWeb3React)();
    const { 0: tried , 1: setTried  } = (0,external_react_.useState)(false);
    (0,external_react_.useEffect)(()=>{
        injected.isAuthorized().then((isAuthorized)=>{
            if (isAuthorized) {
                activate(injected, undefined, true).catch(()=>{
                    setTried(true);
                });
            } else {
                setTried(true);
            }
        });
    }, [
        activate
    ]);
    // if the connection worked, wait until we get confirmation of that to flip the flag
    (0,external_react_.useEffect)(()=>{
        if (!tried && active) {
            setTried(true);
        }
    }, [
        tried,
        active
    ]);
    return tried;
};

;// CONCATENATED MODULE: ./hooks/useENSName.ts


function useENSName(address) {
    const { library , chainId  } = (0,core_.useWeb3React)();
    const { 0: ENSName , 1: setENSName  } = (0,external_react_.useState)("");
    (0,external_react_.useEffect)(()=>{
        if (library && typeof address === "string") {
            let stale = false;
            library.lookupAddress(address).then((name)=>{
                if (!stale && typeof name === "string") {
                    setENSName(name);
                }
            }).catch(()=>{});
            return ()=>{
                stale = true;
                setENSName("");
            };
        }
    }, [
        library,
        address,
        chainId
    ]);
    return ENSName;
};

// EXTERNAL MODULE: external "@metamask/detect-provider"
var detect_provider_ = __webpack_require__(3427);
var detect_provider_default = /*#__PURE__*/__webpack_require__.n(detect_provider_);
;// CONCATENATED MODULE: ./hooks/useMetaMaskOnboarding.ts


function useMetaMaskOnboarding() {
    const onboarding = (0,external_react_.useRef)();
    const { 0: isMetaMaskInstalled , 1: isMetaMaskInstalledSet  } = (0,external_react_.useState)();
    (0,external_react_.useEffect)(()=>{
        if (true) {
            return;
        }
        async function checkForMetaMask() {
            const provider = await detect_provider_default()({
                timeout: 1000,
                mustBeMetaMask: true
            });
            if (provider) {
                isMetaMaskInstalledSet(true);
            } else {
                isMetaMaskInstalledSet(false);
            }
        }
        checkForMetaMask();
    }, []);
    async function startOnboarding() {
        var ref;
        const MetaMaskOnboarding = await Promise.resolve(/* import() */).then(__webpack_require__.t.bind(__webpack_require__, 9652, 23)).then((m)=>m.default
        );
        onboarding.current = new MetaMaskOnboarding();
        (ref = onboarding.current) === null || ref === void 0 ? void 0 : ref.startOnboarding();
    }
    function stopOnboarding() {
        if (onboarding === null || onboarding === void 0 ? void 0 : onboarding.current) {
            onboarding.current.stopOnboarding();
        }
    }
    const isWeb3Available =  false && (0);
    return {
        startOnboarding,
        stopOnboarding,
        isMetaMaskInstalled,
        isWeb3Available
    };
};

// EXTERNAL MODULE: ./util.ts + 3 modules
var util = __webpack_require__(533);
// EXTERNAL MODULE: external "next/router"
var router_ = __webpack_require__(1853);
;// CONCATENATED MODULE: ./components/Account.tsx










const Account = ({ triedToEagerConnect  })=>{
    const { active , error: error1 , activate , chainId , account , setError  } = (0,core_.useWeb3React)();
    const router = (0,router_.useRouter)();
    const { isMetaMaskInstalled , isWeb3Available , startOnboarding , stopOnboarding ,  } = useMetaMaskOnboarding();
    // manage connecting state for injected connector
    const { 0: connecting , 1: setConnecting  } = (0,external_react_.useState)(false);
    (0,external_react_.useEffect)(()=>{
        if (active || error1) {
            setConnecting(false);
            stopOnboarding();
        }
    }, [
        active,
        error1,
        stopOnboarding
    ]);
    const ENSName = useENSName(account);
    if (error1) {
        return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(react_.Button, {
            onClick: async ()=>{
                const success = await (0,util/* switchNetwork */.If)(true);
            },
            children: [
                /*#__PURE__*/ jsx_runtime_.jsx(react_.Icon, {
                    viewBox: "0 0 200 200",
                    color: "red.500",
                    style: {
                        marginRight: "10px"
                    },
                    children: /*#__PURE__*/ jsx_runtime_.jsx("path", {
                        fill: "currentColor",
                        d: "M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
                    })
                }),
                "Switch Network"
            ]
        });
    }
    if (!triedToEagerConnect) {
        return null;
    }
    if (typeof account !== "string") {
        return /*#__PURE__*/ jsx_runtime_.jsx("div", {
            children: isWeb3Available ? /*#__PURE__*/ (0,jsx_runtime_.jsxs)(react_.Button, {
                disabled: connecting,
                onClick: ()=>{
                    setConnecting(true);
                    activate(injected, undefined, true).catch((error)=>{
                        // ignore the error if it's a user rejected request
                        if (error instanceof injected_connector_.UserRejectedRequestError) {
                            setConnecting(false);
                            (0,util/* switchNetwork */.If)(true);
                        } else {
                            setError(error);
                        }
                    });
                },
                colorScheme: "orange",
                bg: "#fc6643",
                loadingText: "Connecting...",
                px: 6,
                _hover: {
                    bg: "orange.390"
                },
                children: [
                    isMetaMaskInstalled ? "Connect to MetaMask" : "Connect to Wallet",
                    " "
                ]
            }) : /*#__PURE__*/ jsx_runtime_.jsx(react_.Button, {
                onClick: startOnboarding,
                children: "Install Metamask"
            })
        });
    }
    return /*#__PURE__*/ jsx_runtime_.jsx(react_.Button, {
        children: ENSName || `${(0,util/* shortenHex */.pm)(account, 4)}`
    });
};
/* harmony default export */ const components_Account = (Account);

;// CONCATENATED MODULE: ./components/Network.tsx




const Network = ()=>{
    const { chainId , account  } = (0,core_.useWeb3React)();
    if (typeof account !== "string") {
        return null;
    }
    return /*#__PURE__*/ jsx_runtime_.jsx(react_.Button, {
        children: (0,util/* getNetwork */.Hy)(chainId)
    });
};
/* harmony default export */ const components_Network = (Network);

// EXTERNAL MODULE: ./node_modules/next/image.js
var next_image = __webpack_require__(5675);
var image_default = /*#__PURE__*/__webpack_require__.n(next_image);
;// CONCATENATED MODULE: ./components/Nav.tsx







// import ETHBalance from './ETHBalance'


const NavLink = ({ children  })=>/*#__PURE__*/ _jsx(Link, {
        px: 2,
        py: 1,
        rounded: "md",
        _hover: {
            textDecoration: "none",
            bg: useColorModeValue("gray.200", "gray.700")
        },
        href: "#",
        children: children
    })
;
function Nav({ page  }) {
    const { colorMode , toggleColorMode  } = (0,react_.useColorMode)();
    const { isOpen , onOpen , onClose  } = (0,react_.useDisclosure)();
    const { account , library , chainId  } = (0,core_.useWeb3React)();
    const triedToEagerConnect = useEagerConnect();
    const router = (0,router_.useRouter)();
    return /*#__PURE__*/ jsx_runtime_.jsx(jsx_runtime_.Fragment, {
        children: /*#__PURE__*/ jsx_runtime_.jsx(react_.Box, {
            px: 4,
            children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)(react_.Flex, {
                h: 16,
                alignItems: "center",
                justifyContent: "space-between",
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx(react_.Box, {
                        children: /*#__PURE__*/ jsx_runtime_.jsx((image_default()), {
                            width: "135",
                            height: "135",
                            src: __webpack_require__(8350)
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx(react_.Flex, {
                        alignItems: "center",
                        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)(react_.Stack, {
                            direction: "row",
                            spacing: 7,
                            children: [
                                typeof account === "string" && chainId === 4 && /*#__PURE__*/ jsx_runtime_.jsx(react_.Button, {
                                    onClick: ()=>router.push(`/${page.toLowerCase()}`)
                                    ,
                                    children: page
                                }),
                                /*#__PURE__*/ jsx_runtime_.jsx(react_.Button, {
                                    onClick: toggleColorMode,
                                    children: colorMode === "light" ? /*#__PURE__*/ jsx_runtime_.jsx(icons_.MoonIcon, {}) : /*#__PURE__*/ jsx_runtime_.jsx(icons_.SunIcon, {})
                                }),
                                /*#__PURE__*/ jsx_runtime_.jsx(components_Network, {}),
                                /*#__PURE__*/ jsx_runtime_.jsx(components_Account, {
                                    triedToEagerConnect: triedToEagerConnect
                                })
                            ]
                        })
                    })
                ]
            })
        })
    });
};


/***/ }),

/***/ 533:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "EV": () => (/* binding */ checkBlindGuess),
  "$P": () => (/* binding */ createDeposit),
  "By": () => (/* binding */ depositEth),
  "UK": () => (/* binding */ generateNote),
  "Kn": () => (/* binding */ getAddress),
  "Hy": () => (/* binding */ getNetwork),
  "p": () => (/* binding */ isSupportedNetwork),
  "NT": () => (/* binding */ poseidonHash),
  "pm": () => (/* binding */ shortenHex),
  "If": () => (/* binding */ switchNetwork),
  "O_": () => (/* binding */ winning),
  "XW": () => (/* binding */ withdraw)
});

// UNUSED EXPORTS: formatEtherscanLink, parseBalance, parseNote, prove

// EXTERNAL MODULE: external "@ethersproject/units"
var units_ = __webpack_require__(3138);
// EXTERNAL MODULE: external "ethers"
var external_ethers_ = __webpack_require__(1982);
;// CONCATENATED MODULE: ./classes/merkleTree.ts
/* eslint-disable no-useless-constructor */ /* eslint-disable camelcase */ class JsStorage {
    constructor(db = {}){
        this.db = db;
    }
    get(key) {
        return this.db[key];
    }
    get_or_element(key, defaultElement) {
        const element = this.db[key];
        if (element === undefined) {
            return defaultElement;
        } else {
            return element;
        }
    }
    put(key, value) {
        if (key === undefined || value === undefined) {
            throw Error("key or value is undefined");
        }
        this.db[key] = value;
    }
    del(key) {
        delete this.db[key];
    }
    put_batch(key_values) {
        key_values.forEach((element)=>{
            this.db[element.key] = element.value;
        });
    }
}
class MerkleTree {
    constructor(n_levels, prefix, hasher, storage = new JsStorage()){
        this.n_levels = n_levels;
        this.prefix = prefix;
        this.hasher = hasher;
        this.storage = storage;
        this.zero_values = [];
        this.totalElements = 0;
        let current_zero_value = "21663839004416932945382355908790599225266501822907911457504978515578255421292";
        this.zero_values.push(current_zero_value);
        for(let i = 0; i < n_levels; i++){
            current_zero_value = this.hasher.hash(current_zero_value, current_zero_value);
            this.zero_values.push(current_zero_value.toString());
        }
    }
    static index_to_key(prefix, level, index) {
        const key = `${prefix}_tree_${level}_${index}`;
        return key;
    }
    async root() {
        const root = await this.storage.get_or_element(MerkleTree.index_to_key(this.prefix, this.n_levels, 0), this.zero_values[this.n_levels]);
        return root;
    }
    async path(index) {
        class PathTraverser {
            constructor(prefix, storage, zero_values){
                this.prefix = prefix;
                this.storage = storage;
                this.zero_values = zero_values;
                this.path_elements = [];
                this.path_index = [];
            }
            async handle_index(level, element_index, sibling_index) {
                const sibling = await this.storage.get_or_element(MerkleTree.index_to_key(this.prefix, level, sibling_index), this.zero_values[level]);
                this.path_elements.push(sibling);
                this.path_index.push(element_index % 2);
            }
        }
        index = Number(index);
        const traverser = new PathTraverser(this.prefix, this.storage, this.zero_values);
        const root = await this.storage.get_or_element(MerkleTree.index_to_key(this.prefix, this.n_levels, 0), this.zero_values[this.n_levels]);
        const element = await this.storage.get_or_element(MerkleTree.index_to_key(this.prefix, 0, index), this.zero_values[0]);
        await this.traverse(index, traverser);
        return {
            root,
            path_elements: traverser.path_elements,
            path_index: traverser.path_index,
            element
        };
    }
    async update(index, element, insert = false) {
        if (!insert && index >= this.totalElements) {
            throw Error("Use insert method for new elements.");
        } else if (insert && index < this.totalElements) {
            throw Error("Use update method for existing elements.");
        }
        try {
            class UpdateTraverser {
                constructor(prefix, storage, hasher, current_element, zero_values){
                    this.prefix = prefix;
                    this.storage = storage;
                    this.hasher = hasher;
                    this.current_element = current_element;
                    this.zero_values = zero_values;
                    this.original_element = "";
                    this.key_values_to_put = [];
                }
                async handle_index(level, element_index, sibling_index) {
                    if (level === 0) {
                        this.original_element = await this.storage.get_or_element(MerkleTree.index_to_key(this.prefix, level, element_index), this.zero_values[level]);
                    }
                    const sibling = await this.storage.get_or_element(MerkleTree.index_to_key(this.prefix, level, sibling_index), this.zero_values[level]);
                    let left, right;
                    if (element_index % 2 === 0) {
                        left = this.current_element;
                        right = sibling;
                    } else {
                        left = sibling;
                        right = this.current_element;
                    }
                    this.key_values_to_put.push({
                        key: MerkleTree.index_to_key(this.prefix, level, element_index),
                        value: this.current_element
                    });
                    this.current_element = this.hasher.hash(left, right);
                }
            }
            const traverser = new UpdateTraverser(this.prefix, this.storage, this.hasher, element, this.zero_values);
            await this.traverse(index, traverser);
            traverser.key_values_to_put.push({
                key: MerkleTree.index_to_key(this.prefix, this.n_levels, 0),
                value: traverser.current_element
            });
            await this.storage.put_batch(traverser.key_values_to_put);
        } catch (e) {
            console.error(e);
        }
    }
    async insert(element) {
        const index = this.totalElements;
        await this.update(index, element, true);
        this.totalElements++;
    }
    async traverse(index, handler) {
        let current_index = index;
        for(let i = 0; i < this.n_levels; i++){
            let sibling_index = current_index;
            if (current_index % 2 === 0) {
                sibling_index += 1;
            } else {
                sibling_index -= 1;
            }
            await handler.handle_index(i, current_index, sibling_index);
            current_index = Math.floor(current_index / 2);
        }
    }
    getIndexByElement(element) {
        for(let i = this.totalElements - 1; i >= 0; i--){
            const elementFromTree = this.storage.get(MerkleTree.index_to_key(this.prefix, 0, i));
            if (elementFromTree === element) {
                return i;
            }
        }
        return false;
    }
}

;// CONCATENATED MODULE: ./classes/PoseidonHasher.ts

class PoseidonHasher {
    constructor(poseidon){
        this.poseidon = poseidon;
    }
    hash(left, right) {
        return poseidonHash(this.poseidon, [
            left,
            right
        ]);
    }
}

// EXTERNAL MODULE: external "path"
var external_path_ = __webpack_require__(1017);
var external_path_default = /*#__PURE__*/__webpack_require__.n(external_path_);
// EXTERNAL MODULE: external "next/config"
var config_ = __webpack_require__(4558);
var config_default = /*#__PURE__*/__webpack_require__.n(config_);
;// CONCATENATED MODULE: ./classes/deposit.ts

class Deposit {
    constructor(nullifier, secret, guess, poseidon){
        this.nullifier = nullifier;
        this.secret = secret;
        this.guess = guess;
        this.poseidon = poseidon;
        this.poseidon = poseidon;
    }
    static new(nullifier, secret, guess, poseidon) {
        return new this(nullifier, secret, guess, poseidon);
    }
    get commitment() {
        return poseidonHash(this.poseidon, [
            this.nullifier,
            this.secret,
            this.guess, 
        ]);
    }
    get nullifierHash() {
        return poseidonHash(this.poseidon, [
            this.nullifier,
            17
        ]);
    }
}

;// CONCATENATED MODULE: ./util.ts







const circomlibjs = __webpack_require__(9197);
const snarkjs = __webpack_require__(2267);
const serverPath = (staticFilePath)=>{
    return external_path_default().join(config_default()().serverRuntimeConfig.PROJECT_ROOT, staticFilePath);
};
function shortenHex(hex, length = 4) {
    return `${hex.substring(0, length + 2)}…${hex.substring(hex.length - length)}`;
}
const ETHERSCAN_PREFIXES = {
    1: "",
    3: "ropsten",
    4: "rinkeby",
    5: "goerli",
    42: "kovan"
};
const createDeposit = async (nullifier = external_ethers_.ethers.utils.randomBytes(15), secret = external_ethers_.ethers.utils.randomBytes(15), guess = 4)=>{
    const poseidon = await circomlibjs.buildPoseidon();
    const deposit = Deposit["new"](nullifier, secret, guess, poseidon);
    return deposit;
};
const generateNote = async (deposit, draw)=>{
    const AMOUNT = "0.1";
    const guess = deposit.guess;
    return `zkpt-eth-${AMOUNT}-${guess}-${draw}-0x${deposit.nullifier}-0x${deposit.secret}`;
};
const parseNote = async (noteString)=>{
    try {
        const noteArray = noteString.split("0x");
        console.log({
            noteArray
        });
        const noteRegex = /zkpt-(?<currency>\w+)-(?<amount>[\d.]+)-(?<guess>\d+)-(?<drawId>\d+)/g;
        const match = noteRegex.exec(noteArray[0]);
        console.log({
            match
        });
        const bytesArrayNullifier = noteArray[1].replace("-", "").split(",").map((x)=>+x
        );
        const nullifier = new Uint8Array(bytesArrayNullifier);
        const bytesArraySecret = noteArray[2].replace("-", "").split(",").map((x)=>+x
        );
        const secret = new Uint8Array(bytesArraySecret);
        return {
            deposit: await createDeposit(nullifier, secret, parseInt(match[3])),
            drawId: parseInt(match[4])
        };
    } catch (err) {
        console.log({
            err
        });
    }
};
const poseidonHash = (poseidon, inputs)=>{
    try {
        const hash = poseidon(inputs.map((x)=>external_ethers_.BigNumber.from(x).toBigInt()
        ));
        // Make the number within the field size
        const hashStr = poseidon.F.toString(hash);
        // Make it a valid hex string
        const hashHex = external_ethers_.BigNumber.from(hashStr).toHexString();
        // pad zero to make it 32 bytes, so that the output can be taken as a bytes32 contract argument
        const bytes32 = external_ethers_.ethers.utils.hexZeroPad(hashHex, 32);
        return bytes32;
    } catch (err) {
        console.log("errrrr in poseidonHash ====>??", err);
    }
};
const generateMerkleProof = async (deposit, drawId, contract)=>{
    const eventFilter = contract.filters.Deposit();
    const events = await contract.queryFilter(eventFilter, 0, "latest");
    const poseidon = await circomlibjs.buildPoseidon();
    const tree = new MerkleTree(20, "test", new PoseidonHasher(poseidon));
    const saltedCommitment = await poseidonHash(poseidon, [
        deposit.commitment,
        drawId, 
    ]);
    console.log({
        saltedCommitment
    });
    const leaves = events.sort((a, b)=>a.args.leafIndex - b.args.leafIndex
    ) // Sort events in chronological order
    .map((e)=>e.args.commitment
    );
    for (const iterator of leaves){
        await tree.insert(iterator);
    }
    // Find current commitment in the tree
    const depositEvent = events.find((e)=>{
        console.log(e.args.commitment, saltedCommitment);
        return e.args.commitment === saltedCommitment;
    });
    const leafIndex = depositEvent ? depositEvent.args.leafIndex : -1;
    const { root , path_elements , path_index  } = await tree.path(leafIndex);
    const isValidRoot = await contract.isKnownRoot(root);
    if (!isValidRoot) {
        return {
            type: "error",
            title: "Merkle Tree",
            message: "Merkle Tree is corrupted either invalid paths"
        };
    }
    const isSpent = await contract.isSpent(deposit.nullifierHash);
    if (isSpent) {
        return {
            type: "error",
            title: "Already Spent",
            message: "The provided note is already spent"
        };
    }
    if (leafIndex < 0) {
        return {
            type: "error",
            title: "Deposit Leaf",
            message: "The deposit is not found in the tree"
        };
    }
    return {
        path_elements,
        path_index,
        root
    };
};
function formatEtherscanLink(type, data) {
    switch(type){
        case "Account":
            {
                const [chainId, address] = data;
                return `https://${ETHERSCAN_PREFIXES[chainId]}etherscan.io/address/${address}`;
            }
        case "Transaction":
            {
                const [chainId, hash] = data;
                return `https://${ETHERSCAN_PREFIXES[chainId]}etherscan.io/tx/${hash}`;
            }
    }
}
const parseBalance = (value, decimals = 18, decimalsToDisplay = 3)=>parseFloat(formatUnits(value, decimals)).toFixed(decimalsToDisplay)
;
const depositEth = async (deposit, contract, draw)=>{
    try {
        const network = await contract.signer.provider.getNetwork();
        let currentDraw = (await contract.currentDrawId()).toNumber();
        const valid = isSupportedNetwork(network.chainId);
        if (!valid) {
            return {
                type: "error",
                title: "Network Errr",
                message: "the selected network is not supported yet try [rinkeby]"
            };
        } else if (parseInt(draw) == currentDraw) {
            return {
                type: "error",
                title: "Draw Id",
                message: `the draw ${draw} is ended please create new note for drawId ${currentDraw}`
            };
        } else {
            const commitment = deposit.commitment;
            const nullifierHash = deposit.nullifierHash;
            const tx = await contract.deposit(commitment, {
                value: external_ethers_.ethers.utils.parseEther("0.01")
            });
            const txReceipt = await tx.wait();
            return {
                type: "success",
                title: "Transaction Success",
                message: `https://rinkeby.etherscan.io/tx/${txReceipt.transactionHash}`
            };
        }
    } catch (err) {
        return {
            type: "error",
            title: "Something went wrong",
            message: err.message
        };
    }
};
const withdraw = async (drawId, random, note, recipient, contract)=>{
    try {
        const { deposit , drawId  } = await parseNote(note);
        console.log({
            deposit
        });
        if (!deposit) {
            return {
                type: "error",
                title: "Invalid Note formet",
                message: "note formet should be [zkpt]-[amount]-[netId]-0x[nullifier]0x[secret]"
            };
        }
        const snarkProof = await generateSnarkProof(drawId, random, deposit, recipient, contract, "0x99d667ff3e5891a5f40288cb94276158ae8176a0", false);
        if (!snarkProof.proof) {
            return snarkProof;
        }
        console.log({
            proof: snarkProof.proof,
            args: snarkProof.args
        });
        const response = await fetch(`/api/withdraw/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                proof: snarkProof.proof,
                args: snarkProof.args
            })
        });
        console.log(response);
        const txResponse = await response.json();
        console.log({
            txResponse
        });
        if (txResponse.transactionHash) {
            return {
                type: "success",
                title: "Transaction Success",
                message: `https://rinkeby.etherscan.io/tx/${txResponse.transactionHash}`
            };
        } else {
            return {
                type: "error",
                title: "Something went wrong",
                message: txResponse.reason ? txResponse.reason : "Something went wrong please try again!"
            };
        }
    } catch (err) {
        console.log("error while withdrawing", {
            err
        });
        return {
            type: "error",
            title: "Something went wrong",
            message: err.message
        };
    }
};
const winning = async (drawId, random, note, recipient, contract)=>{
    try {
        const { deposit  } = await parseNote(note);
        if (!deposit) {
            return {
                type: "error",
                title: "Invalid Note formet",
                message: "note formet should be [zkpt]-[amount]-[netId]-0x[nullifier]0x[secret]"
            };
        }
        const snarkProof = await generateSnarkProof(drawId, random, deposit, recipient, contract, "0x99d667ff3e5891a5f40288cb94276158ae8176a0", true);
        if (!snarkProof.proof) {
            return snarkProof;
        }
        console.log({
            proof: snarkProof.proof,
            args: snarkProof.args
        });
        const response = await fetch(`/api/winning/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                proof: snarkProof.proof,
                args: snarkProof.args
            })
        });
        const txResponse = await response.json();
        return {
            type: "success",
            title: "Transaction Success",
            // @ts-ignore
            message: `https://rinkeby.etherscan.io/tx/${response.transactionHash}`
        };
    } catch (err) {
        console.log("error while withdrawing", {
            err
        });
        return {
            type: "error",
            title: "Something went wrong",
            message: err.message
        };
    }
};
const prove = async (witness, won)=>{
    let wasmPath;
    let zkeyPath;
    if (won) {
        wasmPath = "/winning.wasm";
        zkeyPath = "/winning.zkey";
    } else {
        wasmPath = "/withdraw.wasm";
        zkeyPath = "/withdraw.zkey";
    }
    if (true) {
        wasmPath = serverPath(`/public${wasmPath}`);
        zkeyPath = serverPath(`/public${zkeyPath}`);
    }
    const { proof  } = await snarkjs.groth16.fullProve(witness, wasmPath, zkeyPath);
    const solProof = {
        a: [
            proof.pi_a[0],
            proof.pi_a[1]
        ],
        b: [
            [
                proof.pi_b[0][1],
                proof.pi_b[0][0]
            ],
            [
                proof.pi_b[1][1],
                proof.pi_b[1][0]
            ], 
        ],
        c: [
            proof.pi_c[0],
            proof.pi_c[1]
        ]
    };
    return solProof;
};
const generateSnarkProof = async (drawId, random, deposit, recipient, contract, relayer, won)=>{
    // Compute merkle proof of our commitment
    const response = await generateMerkleProof(deposit, drawId, contract);
    if (response.type) {
        return {
            ...response
        };
    }
    const { root , path_elements , path_index  } = response;
    const witness = {
        // Public
        root,
        nullifierHash: deposit.nullifierHash,
        recipient: recipient,
        relayer,
        fee: 0,
        random: parseInt(random),
        draw: parseInt(drawId),
        // Private
        blind: deposit.guess,
        secret: external_ethers_.BigNumber.from(deposit.secret).toBigInt(),
        nullifier: external_ethers_.BigNumber.from(deposit.nullifier).toBigInt(),
        pathElements: path_elements,
        pathIndices: path_index
    };
    console.log({
        witness
    });
    const solidityProof = await prove(witness, won);
    const args = [
        witness.draw,
        witness.random,
        witness.root,
        witness.nullifierHash,
        witness.recipient,
        witness.relayer,
        witness.fee, 
    ];
    return {
        proof: solidityProof,
        args
    };
};
const getNetwork = (id)=>{
    const networks = {
        1: "mainnet",
        3: "robston",
        4: "rinkeby",
        5: "goerli",
        137: "Polygon Mainnet",
        1666600000: "Mainnet Harmony",
        1666900000: "Devnet Harmony"
    };
    return networks[id];
};
const isSupportedNetwork = (id)=>{
    const networks = {
        1: false,
        3: false,
        4: true,
        5: false,
        137: false,
        1666600000: false,
        1666900000: false
    };
    return networks[id];
};
const getAddress = ()=>{
    return "0xC8b59e543cc298dECa3965a0d6c8612951bd2F24";
};
const checkBlindGuess = async (note, random, draw)=>{
    const { deposit , drawId  } = await parseNote(note);
    if (!deposit) {
        return {
            type: "error",
            title: "Invalid Note formet",
            message: "note formet should be [zkpt]-[amount]-[netId]-0x[nullifier]0x[secret]"
        };
    }
    if (drawId !== parseInt(draw)) {
        return {
            type: "error",
            title: "Invalid Draw",
            message: `Your deposited note has drawId ${drawId} and your are checking in draw ${draw}`
        };
    }
    if (deposit.guess === parseInt(random)) {
        return {
            type: "eligibility",
            msg: "Hurray you have won the draw enter the withdrawal address to withdraw winning amount",
            status: true,
            won: true
        };
    } else {
        return {
            type: "eligibility",
            msg: "Sorry you haven't won this draw try another note or withdraw your amount",
            status: true,
            won: false
        };
    }
};
const switchNetwork = (mainnet)=>{
    if (mainnet) {
        // @ts-ignore
        window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [
                {
                    chainId: "0x4"
                }
            ]
        });
        return;
    } else {
        // @ts-ignore
        window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [
                {
                    chainId: "0x4"
                }
            ]
        });
    }
};


/***/ })

};
;