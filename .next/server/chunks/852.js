"use strict";
exports.id = 852;
exports.ids = [852];
exports.modules = {

/***/ 390:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Kn": () => (/* binding */ getAddress)
});

// UNUSED EXPORTS: checkBlindGuess, createDeposit, depositEth, formatEtherscanLink, generateNote, getNetwork, isSupportedNetwork, parseBalance, parseNote, poseidonHash, prove, shortenHex, switchNetwork, winning, withdraw

// EXTERNAL MODULE: external "@ethersproject/units"
var units_ = __webpack_require__(3138);
// EXTERNAL MODULE: external "ethers"
var external_ethers_ = __webpack_require__(1982);
;// CONCATENATED MODULE: ./classes/PoseidonHasher.ts

class PoseidonHasher_PoseidonHasher {
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
// EXTERNAL MODULE: external "next/config"
var config_ = __webpack_require__(4558);
;// CONCATENATED MODULE: ./classes/deposit.ts

class deposit_Deposit {
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
    return path.join(getConfig().serverRuntimeConfig.PROJECT_ROOT, staticFilePath);
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
const createDeposit = async (nullifier = ethers.utils.randomBytes(15), secret = ethers.utils.randomBytes(15), guess = 4)=>{
    const poseidon = await circomlibjs.buildPoseidon();
    const deposit = Deposit.new(nullifier, secret, guess, poseidon);
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
const util_poseidonHash = (poseidon, inputs)=>{
    try {
        const hash = poseidon(inputs.map((x)=>BigNumber.from(x).toBigInt()
        ));
        // Make the number within the field size
        const hashStr = poseidon.F.toString(hash);
        // Make it a valid hex string
        const hashHex = BigNumber.from(hashStr).toHexString();
        // pad zero to make it 32 bytes, so that the output can be taken as a bytes32 contract argument
        const bytes32 = ethers.utils.hexZeroPad(hashHex, 32);
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
    const saltedCommitment = await util_poseidonHash(poseidon, [
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
                value: ethers.utils.parseEther("0.01")
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
        secret: BigNumber.from(deposit.secret).toBigInt(),
        nullifier: BigNumber.from(deposit.nullifier).toBigInt(),
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


/***/ }),

/***/ 891:
/***/ ((module) => {

module.exports = JSON.parse('[{"inputs":[{"internalType":"contract IVerifier","name":"_verifierWithdraw","type":"address"},{"internalType":"contract IVerifier","name":"_verifierWinning","type":"address"},{"internalType":"contract IWETHGateway","name":"_wethGateway","type":"address"},{"internalType":"uint256","name":"_denomination","type":"uint256"},{"internalType":"uint32","name":"_merkleTreeHeight","type":"uint32"},{"internalType":"address","name":"_hasher","type":"address"},{"internalType":"address","name":"_relayer","type":"address"},{"internalType":"address","name":"_weth","type":"address"},{"internalType":"uint256","name":"_minutes","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"commitment","type":"bytes32"},{"indexed":false,"internalType":"uint32","name":"leafIndex","type":"uint32"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"creator","type":"address"},{"indexed":false,"internalType":"uint256","name":"startTime","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"endTime","type":"uint256"}],"name":"LogNewLottery","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"","type":"address"},{"indexed":false,"internalType":"uint256","name":"","type":"uint256"}],"name":"Received","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"bytes32","name":"nullifierHash","type":"bytes32"},{"indexed":true,"internalType":"address","name":"relayer","type":"address"},{"indexed":false,"internalType":"uint256","name":"fee","type":"uint256"}],"name":"Withdrawal","type":"event"},{"inputs":[],"name":"FIELD_SIZE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"NUMBER_OF_MINUTES","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ROOT_HISTORY_SIZE","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"WETH","outputs":[{"internalType":"contract IWETH","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"ZERO_VALUE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"drawId","type":"uint256"},{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"uint256","name":"_minutes","type":"uint256"},{"internalType":"uint256","name":"reward","type":"uint256"}],"name":"_triggerDraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"currentDrawId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"currentRootIndex","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"denomination","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_commitment","type":"bytes32"}],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"deposits","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"draws","outputs":[{"internalType":"uint256","name":"drawId","type":"uint256"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"endTime","type":"uint256"},{"internalType":"bool","name":"isCompleted","type":"bool"},{"internalType":"bool","name":"isSpent","type":"bool"},{"internalType":"uint256","name":"reward","type":"uint256"},{"internalType":"uint256","name":"random","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"filledSubtrees","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getDraws","outputs":[{"components":[{"internalType":"uint256","name":"drawId","type":"uint256"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"endTime","type":"uint256"},{"internalType":"bool","name":"isCompleted","type":"bool"},{"internalType":"bool","name":"isSpent","type":"bool"},{"internalType":"uint256","name":"reward","type":"uint256"},{"internalType":"uint256","name":"random","type":"uint256"}],"internalType":"struct DrawManager.DrawStruct[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLastRoot","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_left","type":"bytes32"},{"internalType":"bytes32","name":"_right","type":"bytes32"}],"name":"hashLeftRight","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"hasher","outputs":[{"internalType":"contract IHasher","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_root","type":"bytes32"}],"name":"isKnownRoot","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_nullifierHash","type":"bytes32"}],"name":"isSpent","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"levels","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nextIndex","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"nullifierHashes","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"bound","type":"uint256"}],"name":"random","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"reserves","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"roots","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_minutes","type":"uint256"},{"internalType":"bytes32","name":"_entropy","type":"bytes32"}],"name":"triggerDraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_entropy","type":"bytes32"}],"name":"vrf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"wethGateway","outputs":[{"internalType":"contract IWETHGateway","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"uint256[2]","name":"a","type":"uint256[2]"},{"internalType":"uint256[2][2]","name":"b","type":"uint256[2][2]"},{"internalType":"uint256[2]","name":"c","type":"uint256[2]"}],"internalType":"struct Pool.Proof","name":"_proof","type":"tuple"},{"internalType":"bytes32","name":"_root","type":"bytes32"},{"internalType":"bytes32","name":"_nullifierHash","type":"bytes32"},{"internalType":"address payable","name":"_recipient","type":"address"},{"internalType":"address payable","name":"_relayer","type":"address"},{"internalType":"uint256","name":"_fee","type":"uint256"},{"internalType":"uint256","name":"_drawId","type":"uint256"}],"name":"winning","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"winningVerifier","outputs":[{"internalType":"contract IVerifier","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"uint256[2]","name":"a","type":"uint256[2]"},{"internalType":"uint256[2][2]","name":"b","type":"uint256[2][2]"},{"internalType":"uint256[2]","name":"c","type":"uint256[2]"}],"internalType":"struct Pool.Proof","name":"_proof","type":"tuple"},{"internalType":"bytes32","name":"_root","type":"bytes32"},{"internalType":"bytes32","name":"_nullifierHash","type":"bytes32"},{"internalType":"address payable","name":"_recipient","type":"address"},{"internalType":"address payable","name":"_relayer","type":"address"},{"internalType":"uint256","name":"_fee","type":"uint256"},{"internalType":"uint256","name":"_drawId","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"withdrawVerifier","outputs":[{"internalType":"contract IVerifier","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"zeros","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}]');

/***/ })

};
;