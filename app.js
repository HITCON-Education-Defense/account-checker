var sha256 = function sha256(ascii) {
    function rightRotate(value, amount) {
        return (value >>> amount) | (value << (32 - amount));
    };

    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var lengthProperty = 'length'
    var i, j; // Used as a counter across the whole file
    var result = ''

    var words = [];
    var asciiBitLength = ascii[lengthProperty] * 8;

    //* caching results is optional - remove/add slash from front of this line to toggle
    // Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
    // (we actually calculate the first 64, but extra values are just ignored)
    var hash = sha256.h = sha256.h || [];
    // Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
    var k = sha256.k = sha256.k || [];
    var primeCounter = k[lengthProperty];
    /*/
    var hash = [], k = [];
    var primeCounter = 0;
    //*/

    var isComposite = {};
    for (var candidate = 2; primeCounter < 64; candidate++) {
        if (!isComposite[candidate]) {
            for (i = 0; i < 313; i += candidate) {
                isComposite[i] = candidate;
            }
            hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
            k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
        }
    }

    ascii += '\x80' // Append Ƈ' bit (plus zero padding)
    while (ascii[lengthProperty] % 64 - 56) ascii += '\x00' // More zero padding
    for (i = 0; i < ascii[lengthProperty]; i++) {
        j = ascii.charCodeAt(i);
        if (j >> 8) return; // ASCII check: only accept characters in range 0-255
        words[i >> 2] |= j << ((3 - i) % 4) * 8;
    }
    words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
    words[words[lengthProperty]] = (asciiBitLength)

    // process each chunk
    for (j = 0; j < words[lengthProperty];) {
        var w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
        var oldHash = hash;
        // This is now the undefinedworking hash", often labelled as variables a...g
        // (we have to truncate as well, otherwise extra entries at the end accumulate
        hash = hash.slice(0, 8);

        for (i = 0; i < 64; i++) {
            var i2 = i + j;
            // Expand the message into 64 words
            // Used below if 
            var w15 = w[i - 15], w2 = w[i - 2];

            // Iterate
            var a = hash[0], e = hash[4];
            var temp1 = hash[7]
                + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) // S1
                + ((e & hash[5]) ^ ((~e) & hash[6])) // ch
                + k[i]
                // Expand the message schedule if needed
                + (w[i] = (i < 16) ? w[i] : (
                    w[i - 16]
                    + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) // s0
                    + w[i - 7]
                    + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10)) // s1
                ) | 0
                );
            // This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
            var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) // S0
                + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2])); // maj

            hash = [(temp1 + temp2) | 0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
            hash[4] = (hash[4] + temp1) | 0;
        }

        for (i = 0; i < 8; i++) {
            hash[i] = (hash[i] + oldHash[i]) | 0;
        }
    }

    for (i = 0; i < 8; i++) {
        for (j = 3; j + 1; j--) {
            var b = (hash[i] >> (j * 8)) & 255;
            result += ((b < 16) ? 0 : '') + b.toString(16);
        }
    }
    return result;
};

const mapping = {
    "c4aaee9a259bd1186be8b1d109a07a3962286bd9aab707c9a35374034c47939b": "這個是 AD 主機用的管理帳號，可以修改帳號密碼",
    "e79a5be6196298ffbdf0acfc0a88478245b6d71b73866978bbc04369b7384210": "員工帳號，修改名稱及密碼需通知IT部門",
    "d06ca96a793fb3a4d475ec0a2f83ef50f3694d5ba77bd1d8b5dae46bf1c5b76b": "員工帳號，修改名稱及密碼需通知IT部門",
    "04eb34ea4c3cf8b724e9f1d15a220c55429e60716e796b5862f26e74e568a310": "員工帳號，修改名稱及密碼需通知IT部門",
    "dcd9bdc8cfec136f9fe6ab9b2ba8f3044096a8feffc4294870f64caa4356f248": "IT專用維護帳號，請勿修改",
    "8308d46cdbd682fbb1c1d283fd6bfaedee8b8e31bf0daf37eca481b9e0076239": "帳號用途不明",
    "f9b7d50a342ff188d8030fb9e9bd7d83943c576b5ce9320d25a75124c8263d52": "離職員工帳號",
    "f9347a2773314c7a5d556af6e00a0ff75c8d49b6e72a7c9b1a433d61311f28d9": "離職員工帳號",
    "6b976aa2e9f51d9ebb190254676d043e606a3697b1c86ea16382d32e8ab55e0c": "這個是 IIS 主機用的管理帳號，可以修改帳號密碼",
    "2f0cca6fb469e4c399b9a032c707be414b7a2a11f06a9ef31d2c1242b2b74ce6": "員工帳號，修改名稱及密碼需通知IT部門",
    "200a6876d6f5b506743ddc85b13750fed229e6169db1f0bbc53c2c5ff1e6faa1": "管理者帳號，修改名稱及密碼需通知IT部門",
    "2cd037266d180bb44b18c622f24efeac7e0196ec1187c1d200b378cf2ddfa7c8": "離職員工帳號",
    "137fe0d9a1ac35a30d070c826bc2f1c6a4cd21791285d01b78a744ae3c96a08d": "離職員工帳號",
    "6bfae690bbf180286340d19be6ca29dc53886ef5c298c99e98178608279954b5": "帳號用途不明",
    "8713bfa5cf78647f2878331ff20e4db317d798816c3760eaa1b0bf2f9bd42161": "管理者帳號，修改名稱及密碼需通知IT部門",
    "c7654d551ec1c0e868001810542e87c7dc421ba72ebd3ceca2a3d1ff887ca249": "員工帳號，修改名稱及密碼需通知IT部門",
    "3dc5fc6b02ffa7d65fa05872275e6569f85ba21fae80b82caa5bbe6d25465cf6": "IT專用維護帳號，請勿修改",
    "e2d93feb36fd3bd7c49eeda25c0ae1ffbedcbc15b34a5a6a46e4f480e3a78f3f": "帳號用途不明",
    "fc81253a78762eb12afb7c7d1dfafea836261f69b3dd783b5ae588b97bcfff82": "離職員工帳號",
    "2d98a6847bae68508f87b20ba9f80f95d7a2a4512413b62fd7e07b419e21b2b1": "離職員工帳號",
    "4eecaf6df526a76c0d3d3840b4b10d2f7147cdd5bc20dfaa8b75f59d6486cfb2": "離職員工帳號",
    "2017ef31d216b13b8b7acf3b822e7494f3a486410041c1e528aba7079dee1685": "帳號用途不明",
    "228ae21f2d683150cfb0d9b892c94cd66bb22a00de159def57538610cf88b5c0": "管理者帳號，修改名稱及密碼需通知IT部門",
    "da45520b91d5ab9aa9a1cec23b0aeb6ac16abe2f5b2bf94b612f4ed0c288ce96": "IT專用維護帳號，請勿修改",
    "9236db0ffbfcf70d523ac8e9c4f585bfb73279e63064e398cb70ef5c93f111f3": "帳號用途不明",
    "69ad1a25485e4cbc8b49cec940c7d11181b125f80958e677ea8c8156f0eee0ff": "員工帳號，修改需要通知IT部門",
    "8089895ecd1bd40e219a28fc73eb9e4ea1b89fae9aed45eff95e4997e6fd10a9": "員工帳號，修改名稱及密碼需通知IT部門",
    "beef1ad3c7b38c95d3c35513a8f18e7e69b03c35b324cae8888812ac8d9ca993": "管理者帳號，修改名稱及密碼需通知IT部門",
    "0eb94ef7de71dbbc06eb70fea575efc1baa953ca5c3c28dfb6f9ecb9263aacae": "帳號用途不明",
    "f446ede272c6f0f1c196d7a5b8819b911125cee6f0ade3cf4c8ff1f611ef5269": "離職員工帳號",
    "f9e85bb894388efc218866a415de2519cbb0e997ec85cf1301083cfe14d26261": "離職員工帳號",
    "7c8a408423ac33c218728beccacbea3dafcd23487a1f2bab8c7c7fb0466b97fc": "帳號用途不明",
}

document.getElementById('btn').onclick = () => {
    const hash = sha256(document.getElementById('username').value + document.getElementById('org').value + "looooongsalt");
    if (hash in mapping)
        msg.querySelector('.message-body').textContent = mapping[hash];
    else
        msg.querySelector('.message-body').textContent = "蛤，這誰我完全沒聽過";
};



