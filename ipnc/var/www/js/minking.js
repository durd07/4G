/* 明景云台相关，详见协议文档 */

function minkingChksum(data) {
    var cs = 0;

    for (var i = 0; i < data.length; i++) {
        cs ^= data[i];
    }

    return cs;
}

function minkingMkCmd(data) {
    var str = new Array();
    str[0] = 0xEA;
    str[1] = 0xD5;
    str[2] = data.length;
    str[3] = ~data.length & 0xFF;
    str = str.concat(data);
    return str.concat(minkingChksum(data));
}

function minkingPtzStopCmd() {
    var data = new Array();

    data[0] = 0x01;
    data[1] = 0x00;
    data[2] = 0x00;
    data[3] = 0x00;
    data[4] = 0x00;
    data[5] = 0x00;

    return minkingMkCmd(data);
}

function minkingTiltDownCmd() {
    var data = new Array();

    data[0] = 0x01;
    data[1] = 0x00;
    data[2] = 0x10;
    data[3] = 0x00;
    data[4] = 0x20;
    data[5] = 0x00;

    return minkingMkCmd(data);
}

function minkingTiltUpCmd() {
    var data = new Array();

    data[0] = 0x01;
    data[1] = 0x00;
    data[2] = 0x08;
    data[3] = 0x00;
    data[4] = 0x20;
    data[5] = 0x00;

    return minkingMkCmd(data);
}

function minkingPanLeftCmd() {
    var data = new Array();

    data[0] = 0x01;
    data[1] = 0x00;
    data[2] = 0x04;
    data[3] = 0x20;
    data[4] = 0x00;
    data[5] = 0x00;

    return minkingMkCmd(data);
}

function minkingPanRightCmd() {
    var data = new Array();

    data[0] = 0x01;
    data[1] = 0x00;
    data[2] = 0x02;
    data[3] = 0x20;
    data[4] = 0x00;
    data[5] = 0x00;

    return minkingMkCmd(data);
}

function minkingWiperCmd(action) {
    var data = new Array();

    data[0] = 0x01;
    data[1] = 0x00;
    data[2] = 0x71;
    data[3] = 0x3D;
    data[4] = action;

    return minkingMkCmd(data);
}

function minkingWiperOnCmd() {
    return minkingWiperCmd(2);
}

function minkingWiperOffCmd() {
    return minkingWiperCmd(3);
}

function minkingWiperOnceCmd() {
    return minkingWiperCmd(4);
}
