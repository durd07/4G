/* 松下机芯相关，详见协议文档 */

/* 松下机芯协议校验方法 */
function panasonicChksum(datas) {
    var cs = 256;

    for (var i = 0; i < datas.length; i++) {
        cs -= datas[i];
    }
    cs &= 0x7F;

    return cs;
}

/* 生成指令字符串 */
function panasonicMkCmd(datas) {
    var str = new Array();
    str = datas;
    var datasLen = datas.length;
    str[datasLen] = panasonicChksum(datas);
    str[datasLen+1] = 0xFF;
    return str;
}

function panasonicParseResponse(cmd) {
    SendHttp(c_iniUrl + GetSetterCmdKV("panasonic_camera_get", cmd), false, GetResult);
    var txt = g_resultTxt;
    var response = null;
    if ((txt.indexOf("OK panasonic_camera_get") >= 0) && (txt.indexOf("C0") > 0)) {
        var result = txt.split(' ');
        response = result[result.length - 1].split(',');
        for (var i = 0; i < response.length; i++) {
            response[i] = parseInt(response[i], 16);
            if (isNaN(response[i]))
                response[i] = 0;
        }
    }
    return response;
}

function panasonicModeCmd(mode) {
    var datas = new Array();
    datas[0] = 0xA0;
    datas[1] = 0x01;
    datas[2] = 0x21;
    datas[3] = mode;
    return panasonicMkCmd(datas);
}

function panasonicZoomCmd(values) {
    var datas = new Array();
    datas[0] = 0xA0;
    datas[1] = 0x02;
    return panasonicMkCmd(datas.concat(values));
}

function panasonicZoomTeleCmd() {
    var datas = new Array();
    datas[0] = 0x05;
    return panasonicZoomCmd(datas);
}

function panasonicZoomWideCmd() {
    var datas = new Array();
    datas[0] = 0x06;
    return panasonicZoomCmd(datas);
}

function panasonicZoomStopCmd() {
    var datas = new Array();
    datas[0] = 0x07;
    return panasonicZoomCmd(datas);
}

function panasonicZoomSpeedCmd(speed) {
    var datas = new Array();
    datas[0] = 0x08;
    datas[1] = speed;
    return panasonicZoomCmd(datas);
}

function panasonicZoomOpticalLimitterCmd(wide, tele) {
    var datas = new Array();
    datas[0] = 0x19;
    datas[1] = wide;
    datas[2] = tele;
    return panasonicZoomCmd(datas);
}

function panasonicFocusCmd(values) {
    var datas = new Array();
    datas[0] = 0xA0;
    datas[1] = 0x03;
    return panasonicMkCmd(datas.concat(values));
}

function panasonicFocusModeCmd(mode) {
    var datas = new Array();
    datas[0] = mode;
    return panasonicFocusCmd(datas);
}

function panasonicFocusFarCmd() {
    var datas = new Array();
    datas[0] = 0x05;
    return panasonicFocusCmd(datas);
}

function panasonicFocusNearCmd() {
    var datas = new Array();
    datas[0] = 0x06;
    return panasonicFocusCmd(datas);
}

function panasonicFocusStopCmd() {
    var datas = new Array();
    datas[0] = 0x07;
    return panasonicFocusCmd(datas);
}

function panasonicFocusSpeedCmd(speed) {
    var datas = new Array();
    datas[0] = 0x08;
    datas[1] = speed;
    return panasonicFocusCmd(datas);
}

function panasonicPresetSetCmd() {
    var datas = new Array();
    datas[0] = 0xA0;
    datas[1] = 0x01;
    datas[2] = 0x14;
    datas[3] = 0x01;
	return panasonicMkCmd(datas);
}

function panasonicPresetCallCmd() {
    var datas = new Array();
    datas[0] = 0xA0;
    datas[1] = 0x01;
    datas[2] = 0x14;
    datas[3] = 0x02;
	return panasonicMkCmd(datas);
}

function panasonicWhiteBalanceCmd(values) {
    var datas = new Array();
    datas[0] = 0xA0;
    datas[1] = 0x04;
    return panasonicMkCmd(datas.concat(values));
}

function panasonicWhiteBalanceModeCmd(mode) {
    var datas = new Array();
    datas[0] = 0x07;
    datas[1] = mode;
    return panasonicWhiteBalanceCmd(datas);
}

function panasonicIrisCmd(values) {
    var datas = new Array();
    datas[0] = 0xA0;
    datas[1] = 0x05;
    return panasonicMkCmd(datas.concat(values));
}

function panasonicIrisModeCmd(mode) {
    var datas = new Array();
    datas[0] = mode;
    return panasonicIrisCmd(datas);
}

function panasonicGetTempCmd() {
    var datas = new Array();
    datas[0] = 0x80;
    datas[1] = 0x4A;
    datas[2] = 0x0D;
    return panasonicMkCmd(datas);
}

function panasonicGetTemp() {
    var cmd = panasonicGetTempCmd();
    var temp = "Unknown";

    var response = panasonicParseResponse(cmd);
    if (response != null)
    {
        if ((response.length >= 8) && (response[0] == 0xC0) && (response[7] == 0xFF) && (response[4] < 10) && (response[5] < 10))
        {
            temp = response[4] * 10 + response[5];
            if (response[3] != 0)
            {
                temp = 0 - temp;
            }
        }
    }

    return temp;
}

function panasonicGetRgainCmd() {
    var datas = new Array();
    datas[0] = 0x80;
    datas[1] = 0x04;
    datas[2] = 0x13;
    return panasonicMkCmd(datas);
}

function panasonicGetRgain() {
    var cmd = panasonicGetRgainCmd();
    return panasonicParseGain(cmd);
}

function panasonicParseGain(cmd) {
    var gain = 0;
    var response = panasonicParseResponse(cmd);
    if (response != null)
    {
        if ((response.length >= 7) && (response[0] == 0xC0) && (response[6] == 0xFF))
        {
            gain = response[3] * 16 + response[4];
        }
    }

    return gain;
}

function panasonicGetBgainCmd() {
    var datas = new Array();
    datas[0] = 0x80;
    datas[1] = 0x04;
    datas[2] = 0x1D;
    return panasonicMkCmd(datas);
}

function panasonicGetBgain() {
    var cmd = panasonicGetBgainCmd();
    return panasonicParseGain(cmd);
}

function panasonicGetWBmodeCmd() {
    var datas = new Array();
    datas[0] = 0x80;
    datas[1] = 0x04;
    datas[2] = 0x07;
    return panasonicMkCmd(datas);
}

function panasonicGetWBmode() {
    var cmd = panasonicGetWBmodeCmd();
    var mode = 0;
    var response = panasonicParseResponse(cmd);
    if (response != null)
    {
        if ((response.length >= 6) && (response[0] == 0xC0) && (response[5] == 0xFF))
        {
            mode = response[3];
        }
    }

    return mode;
}

function panasonicGetZoomLimiterCmd() {
    var datas = new Array();
    datas[0] = 0x80;
    datas[1] = 0x02;
    datas[2] = 0x19;
    return panasonicMkCmd(datas);
}

function panasonicGetZoomStart() {
    var cmd = panasonicGetZoomLimiterCmd();
    var start = 0;
    var response = panasonicParseResponse(cmd);
    if (response != null)
    {
        if ((response.length >= 7) && (response[0] == 0xC0) && (response[6] == 0xFF))
        {
            start = response[3] - 1;
        }
    }

    return start;
}

function panasonicGetZoomEnd() {
    var cmd = panasonicGetZoomLimiterCmd();
    var end = 0;
    var response = panasonicParseResponse(cmd);
    if (response != null)
    {
        if ((response.length >= 7) && (response[0] == 0xC0) && (response[6] == 0xFF))
        {
            end = response[4] - 1;
        }
    }

    return end;
}

function panasonicGetDNLevelCmd() {
    var datas = new Array();
    datas[0] = 0x80;
    datas[1] = 0x28;
    datas[2] = 0x05;
    return panasonicMkCmd(datas);
}

function panasonicGetDNLevel() {
    var cmd = panasonicGetDNLevelCmd();
    var level = 0;
    var response = panasonicParseResponse(cmd);
    if (response != null)
    {
        if ((response.length >= 6) && (response[0] == 0xC0) && (response[5] == 0xFF))
        {
            level = response[3];
        }
    }

    return level;
}

function panasonicSetDNLevelCmd(level) {
    var datas = new Array();
    datas[0] = 0xA0;
    datas[1] = 0x28;
    datas[2] = 0x05;
    datas[3] = level;
    return panasonicMkCmd(datas);
}

function panasonicGetDNDelayCmd() {
    var datas = new Array();
    datas[0] = 0x80;
    datas[1] = 0x28;
    datas[2] = 0x16;
    return panasonicMkCmd(datas);
}

function panasonicGetDNDelay() {
    var cmd = panasonicGetDNDelayCmd();
    var delay = 0;
    var response = panasonicParseResponse(cmd);
    if (response != null)
    {
        if ((response.length >= 6) && (response[0] == 0xC0) && (response[5] == 0xFF))
        {
            delay = Math.floor((response[3] - 3) / 5);
        }
    }

    return delay;
}

function panasonicSetDNDelayCmd(delay) {
    var datas = new Array();
    datas[0] = 0xA0;
    datas[1] = 0x28;
    datas[2] = 0x16;
    datas[3] = delay * 5 + 5;
    return panasonicMkCmd(datas);
}

function panasonicGetGammaCmd() {
    var datas = new Array();
    datas[0] = 0x80;
    datas[1] = 0x0C;
    return panasonicMkCmd(datas);
}

function panasonicGetGamma() {
    var cmd = panasonicGetGammaCmd();
    var gamma = 0;
    var response = panasonicParseResponse(cmd);
    if (response != null)
    {
        if ((response.length >= 5) && (response[0] == 0xC0) && (response[4] == 0xFF))
        {
            gamma = response[2];
        }
    }

    return gamma;
}

function panasonicSetGammaCmd(gamma) {
    var datas = new Array();
    datas[0] = 0xA0;
    datas[1] = 0x0C;
    datas[2] = gamma;
    return panasonicMkCmd(datas);
}

function panasonicGetFogCorrectCmd() {
    var datas = new Array();
    datas[0] = 0x80;
    datas[1] = 0x36;
    datas[2] = 0x00;
    return panasonicMkCmd(datas);
}

function panasonicGetFogCorrect() {
    var cmd = panasonicGetFogCorrectCmd();
    var value = 0;
    var response = panasonicParseResponse(cmd);
    if (response != null)
    {
        if ((response.length >= 6) && (response[0] == 0xC0) && (response[5] == 0xFF))
        {
            value = response[3];
        }
    }

    return value;
}

function panasonicSetFogCorrectCmd(value) {
    var datas = new Array();
    datas[0] = 0xA0;
    datas[1] = 0x36;
    datas[2] = 0x00;
    datas[3] = value;
    return panasonicMkCmd(datas);
}

function panasonicGetStabilizerCmd() {
    var datas = new Array();
    datas[0] = 0x80;
    datas[1] = 0x33;
    datas[2] = 0x00;
    return panasonicMkCmd(datas);
}

function panasonicGetStabilizer() {
    var cmd = panasonicGetStabilizerCmd();
    var value = 0;
    var response = panasonicParseResponse(cmd);
    if (response != null)
    {
        if ((response.length >= 6) && (response[0] == 0xC0) && (response[5] == 0xFF))
        {
            value = response[3];
        }
    }

    return value;
}

function panasonicSetStabilizerCmd(value) {
    var datas = new Array();
    datas[0] = 0xA0;
    datas[1] = 0x33;
    datas[2] = 0x00;
    datas[3] = value;
    return panasonicMkCmd(datas);
}

function panasonicGetStabilizerLevelCmd() {
    var datas = new Array();
    datas[0] = 0x80;
    datas[1] = 0x33;
    datas[2] = 0x01;
    return panasonicMkCmd(datas);
}

function panasonicGetStabilizerLevel() {
    var cmd = panasonicGetStabilizerLevelCmd();
    var value = 0;
    var response = panasonicParseResponse(cmd);
    if (response != null)
    {
        if ((response.length >= 6) && (response[0] == 0xC0) && (response[5] == 0xFF))
        {
            value = response[3];
        }
    }

    return value;
}

function panasonicSetStabilizerLevelCmd(value) {
    var datas = new Array();
    datas[0] = 0xA0;
    datas[1] = 0x33;
    datas[2] = 0x01;
    datas[3] = value;
    return panasonicMkCmd(datas);
}

function panasonicGetZoomRatioCmd() {
    var datas = new Array();
    datas[0] = 0x80;
    datas[1] = 0x14;
    datas[2] = 0x00;
    return panasonicMkCmd(datas);
}

function panasonicGetZoomRatio() {
    var cmd = panasonicGetZoomRatioCmd();
    var value = 0;
    var response = panasonicParseResponse(cmd);
    if (response != null)
    {
        if ((response.length >= 6) && (response[0] == 0xC0) && (response[5] == 0xFF))
        {
            value = response[3];
        }
    }

    return value;
}

function panasonicSetZoomRatioCmd(value) {
    var datas = new Array();
    datas[0] = 0xA0;
    datas[1] = 0x14;
    datas[2] = 0x00;
    datas[3] = value;
    return panasonicMkCmd(datas);
}

function panasonicGetMirrorCmd() {
    var datas = new Array();
    datas[0] = 0x80;
    datas[1] = 0x0D;
    return panasonicMkCmd(datas);
}

function panasonicGetMirror() {
    var cmd = panasonicGetMirrorCmd();
    var value = 0;
    var response = panasonicParseResponse(cmd);
    if (response != null)
    {
        if ((response.length >= 5) && (response[0] == 0xC0) && (response[4] == 0xFF))
        {
            value = response[2];
        }
    }

    return value;
}

function panasonicSetMirrorCmd(value) {
    var datas = new Array();
    datas[0] = 0xA0;
    datas[1] = 0x0D;
    datas[2] = value;
    return panasonicMkCmd(datas);
}

function panasonicGetVividColorCmd() {
    var datas = new Array();
    datas[0] = 0x80;
    datas[1] = 0x30;
    return panasonicMkCmd(datas);
}

function panasonicGetVividColor() {
    var cmd = panasonicGetVividColorCmd();
    var value = 0;
    var response = panasonicParseResponse(cmd);
    if (response != null)
    {
        if ((response.length >= 6) && (response[0] == 0xC0) && (response[5] == 0xFF))
        {
            value = response[2] * 16 + response[3];
        }
    }

    return value;
}

function panasonicSetVividColorCmd(value) {
    var datas = new Array();
    datas[0] = 0xA0;
    datas[1] = 0x30;
    datas[2] = 0x03;
    datas[3] = Math.floor(value / 16);
    datas[4] = value % 16;
    return panasonicMkCmd(datas);
}

function panasonicGetSenseUpCmd() {
    var datas = new Array();
    datas[0] = 0x80;
    datas[1] = 0x07;
    datas[2] = 0x1D;
    return panasonicMkCmd(datas);
}

function panasonicGetSenseUp() {
    var cmd = panasonicGetSenseUpCmd();
    var value = 0;
    var response = panasonicParseResponse(cmd);
    if (response != null)
    {
        if ((response.length >= 6) && (response[0] == 0xC0) && (response[5] == 0xFF))
        {
            value = response[3];
        }
    }

    return value;
}

function panasonicSetSenseUpCmd(value) {
    var datas = new Array();
    datas[0] = 0xA0;
    datas[1] = 0x07;
    datas[2] = 0x1D;
    datas[3] = value;
    return panasonicMkCmd(datas);
}

function panasonicGetShutterModeCmd() {
    var datas = new Array();
    datas[0] = 0x80;
    datas[1] = 0x07;
    datas[2] = 0x0E;
    return panasonicMkCmd(datas);
}

function panasonicGetShutterMode() {
    var cmd = panasonicGetShutterModeCmd();
    var value = 0;
    var response = panasonicParseResponse(cmd);
    if (response != null)
    {
        if ((response.length >= 6) && (response[0] == 0xC0) && (response[5] == 0xFF))
        {
            value = response[3];
        }
    }

    return value;
}

function panasonicSetShutterModeCmd(value) {
    var datas = new Array();
    datas[0] = 0xA0;
    datas[1] = 0x07;
    datas[2] = 0x0E;
    datas[3] = value;
    return panasonicMkCmd(datas);
}

function panasonicGetLongExpCmd() {
    var datas = new Array();
    datas[0] = 0x80;
    datas[1] = 0x07;
    datas[2] = 0x11;
    return panasonicMkCmd(datas);
}

function panasonicGetLongExp() {
    var cmd = panasonicGetLongExpCmd();
    var value = 0;
    var response = panasonicParseResponse(cmd);
    if (response != null)
    {
        if ((response.length >= 6) && (response[0] == 0xC0) && (response[5] == 0xFF))
        {
            value = response[3];
        }
    }

    return value;
}

function panasonicSetLongExpCmd(value) {
    var datas = new Array();
    datas[0] = 0xA0;
    datas[1] = 0x07;
    datas[2] = 0x11;
    datas[3] = value;
    return panasonicMkCmd(datas);
}

function panasonicGetShortExpCmd() {
    var datas = new Array();
    datas[0] = 0x80;
    datas[1] = 0x07;
    datas[2] = 0x12;
    return panasonicMkCmd(datas);
}

function panasonicGetShortExp() {
    var cmd = panasonicGetShortExpCmd();
    var value = 0;
    var response = panasonicParseResponse(cmd);
    if (response != null)
    {
        if ((response.length >= 6) && (response[0] == 0xC0) && (response[5] == 0xFF))
        {
            value = response[3];
        }
    }

    return value;
}

function panasonicSetShortExpCmd(value) {
    var datas = new Array();
    datas[0] = 0xA0;
    datas[1] = 0x07;
    datas[2] = 0x12;
    datas[3] = value;
    return panasonicMkCmd(datas);
}

function panasonicGetApertureVCmd() {
    var datas = new Array();
    datas[0] = 0x80;
    datas[1] = 0x0B;
    datas[2] = 0x13;
    return panasonicMkCmd(datas);
}

function panasonicGetApertureV() {
    var cmd = panasonicGetApertureVCmd();
    var value = 0;
    var response = panasonicParseResponse(cmd);
    if (response != null)
    {
        if ((response.length >= 7) && (response[0] == 0xC0) && (response[6] == 0xFF))
        {
            value = response[3] * 16 + response[4];
        }
    }

    return value;
}

function panasonicSetApertureVCmd(value) {
    var datas = new Array();
    datas[0] = 0xA0;
    datas[1] = 0x0B;
    datas[2] = 0x13;
    datas[3] = Math.floor(value / 16);
    datas[4] = value % 16;
    return panasonicMkCmd(datas);
}

function panasonicGetApertureHCmd() {
    var datas = new Array();
    datas[0] = 0x80;
    datas[1] = 0x0B;
    datas[2] = 0x1D;
    return panasonicMkCmd(datas);
}

function panasonicGetApertureH() {
    var cmd = panasonicGetApertureHCmd();
    var value = 0;
    var response = panasonicParseResponse(cmd);
    if (response != null)
    {
        if ((response.length >= 7) && (response[0] == 0xC0) && (response[6] == 0xFF))
        {
            value = response[3] * 16 + response[4];
        }
    }

    return value;
}

function panasonicSetApertureHCmd(value) {
    var datas = new Array();
    datas[0] = 0xA0;
    datas[1] = 0x0B;
    datas[2] = 0x1D;
    datas[3] = Math.floor(value / 16);
    datas[4] = value % 16;
    return panasonicMkCmd(datas);
}

function panasonicGetDNRCmd() {
    var datas = new Array();
    datas[0] = 0x80;
    datas[1] = 0x28;
    datas[2] = 0x14;
    return panasonicMkCmd(datas);
}

function panasonicGetDNR() {
    var cmd = panasonicGetDNRCmd();
    var value = 0;
    var response = panasonicParseResponse(cmd);
    if (response != null)
    {
        if ((response.length >= 6) && (response[0] == 0xC0) && (response[5] == 0xFF))
        {
            value = response[3];
        }
    }

    return value;
}

function panasonicSetDNRCmd(value) {
    var datas = new Array();
    datas[0] = 0xA0;
    datas[1] = 0x28;
    datas[2] = 0x14 + value;
    return panasonicMkCmd(datas);
}

function panasonicGetDNRLevelCmd() {
    var datas = new Array();
    datas[0] = 0x80;
    datas[1] = 0x28;
    datas[2] = 0x13;
    return panasonicMkCmd(datas);
}

function panasonicGetDNRLevel() {
    var cmd = panasonicGetDNRLevelCmd();
    var value = 0;
    var response = panasonicParseResponse(cmd);
    if (response != null)
    {
        if ((response.length >= 6) && (response[0] == 0xC0) && (response[5] == 0xFF))
        {
            value = response[3];
        }
    }

    return value;
}

function panasonicSetDNRLevelCmd(value) {
    var datas = new Array();
    datas[0] = 0xA0;
    datas[1] = 0x28;
    datas[2] = 0x13;
    datas[3] = value;
    return panasonicMkCmd(datas);
}

function panasonicGetSlowAEResponseCmd() {
    var datas = new Array();
    datas[0] = 0x80;
    datas[1] = 0x05;
    datas[2] = 0x20;
    return panasonicMkCmd(datas);
}

function panasonicGetSlowAEResponse() {
    var cmd = panasonicGetSlowAEResponseCmd();
    var value = 0;
    var response = panasonicParseResponse(cmd);
    if (response != null)
    {
        if ((response.length >= 8) && (response[0] == 0xC0) && (response[7] == 0xFF))
        {
            value = (response[3] << 8) + (response[4] << 4) + response[5];
        }
    }

    return value;
}

function panasonicSetSlowAEResponseCmd(value) {
    var datas = new Array();
    datas[0] = 0xA0;
    datas[1] = 0x05;
    datas[2] = 0x20;
    datas[3] = (value >> 8) & 0x0F;
    datas[4] = (value >> 4) & 0x0F;
    datas[5] = value & 0x0F;
    return panasonicMkCmd(datas);
}

function panasonicGetIrisLevelCmd() {
    var datas = new Array();
    datas[0] = 0x80;
    datas[1] = 0x05;
    datas[2] = 0x13;
    return panasonicMkCmd(datas);
}

function panasonicGetIrisLevel() {
    var cmd = panasonicGetIrisLevelCmd();
    var value = 0;
    var response = panasonicParseResponse(cmd);
    
	if (response != null)
    {
        if ((response.length >= 7) && (response[0] == 0xC0) && (response[6] == 0xFF))
        {
            value = (response[3] << 4) + response[4];
        }
    }
	
    return value;
}


function panasonicGetBlackLevelCmd() {
    var datas = new Array();
    datas[0] = 0x80;
    datas[1] = 0x32;
    return panasonicMkCmd(datas);
}

function panasonicGetBlackLevel() {
    var cmd = panasonicGetBlackLevelCmd();
    var value = 0;
    var response = panasonicParseResponse(cmd);
	//alert(response);
    if (response != null)
    {
        if ((response.length >= 6) && (response[0] == 0xC0) && (response[5] == 0xFF))
        {
            value = (response[2] << 4) + response[3];
        }
    }
	//alert(value);
    return value;
}


function panasonicSetIrisLevelCmd(value) {
    var datas = new Array();
    datas[0] = 0xA0;
    datas[1] = 0x05;
    datas[2] = 0x13;
    datas[3] = (value >> 4) & 0x0F;
    datas[4] = value & 0x0F;
    return panasonicMkCmd(datas);
}

function panasonicSetBlackLevelCmd(value) {
    var datas = new Array();
    datas[0] = 0xA0;
    datas[1] = 0x32;
    datas[2] = 0x03;
    datas[3] = (value >> 4) & 0x0F;
    datas[4] = value & 0x0F;
    return panasonicMkCmd(datas);
}


function panasonicSetATWredCmd(value) {
    //alert(value);
	var datas = new Array();
    datas[0] = 0xA0;
    datas[1] = 0x04;
    datas[2] = 0x13;
    datas[3] = (value >> 4) & 0x0F;
    datas[4] = value & 0x0F;
	//alert(panasonicMkCmd(datas));
    return panasonicMkCmd(datas);
}
function panasonicSetATWblueCmd(value) {
    //alert(value);
	var datas = new Array();
    datas[0] = 0xA0;
    datas[1] = 0x04;
    datas[2] = 0x1d;
    datas[3] = (value >> 4) & 0x0F;
    datas[4] = value & 0x0F;
	//alert(panasonicMkCmd(datas));
    return panasonicMkCmd(datas);
}
function panasonicGetIrisStopCmd() {
    var datas = new Array();
    datas[0] = 0x80;
    datas[1] = 0x05;
    datas[2] = 0x1D;
    return panasonicMkCmd(datas);
}

function panasonicGetIrisStop() {
    var cmd = panasonicGetIrisStopCmd();
    var value = 0;
    var response = panasonicParseResponse(cmd);
    if (response != null)
    {
        if ((response.length >= 7) && (response[0] == 0xC0) && (response[6] == 0xFF))
        {
            value = (response[3] << 4) + response[4];
        }
    }

    if (value > 225) {
        return 0;
    } else if (value > 160) {
        return 1;
    } else if (value > 120) {
        return 2;
    } else if (value > 88) {
        return 3;
    } else if (value > 68) {
        return 4;
    } else if (value > 56) {
        return 5;
    } else if (value > 40) {
        return 6;
    } else if (value > 20) {
        return 7;
    } else {
        return 8;
    }
}

function panasonicSetIrisStopCmd(value) {
    switch (value) {
    case "0":
        value = 255;
        break;
    case "1":
        value = 190;
        break;
    case "2":
        value = 133;
        break;
    case "3":
        value = 99;
        break;
    case "4":
        value = 76;
        break;
    case "5":
        value = 60;
        break;
    case "6":
        value = 47;
        break;
    case "7":
        value = 37;
        break;
    default:
        value = 0;
        break;
    }

    var datas = new Array();
    datas[0] = 0xA0;
    datas[1] = 0x05;
    datas[2] = 0x1D;
    datas[3] = (value >> 4) & 0x0F;
    datas[4] = value & 0x0F;

    return panasonicMkCmd(datas);
}

function panasonicGetSDCmd() {
    var datas = new Array();
    datas[0] = 0x80;
    datas[1] = 0x06;
    datas[2] = 0x20;
    return panasonicMkCmd(datas);
}

function panasonicGetSD() {
    var cmd = panasonicGetSDCmd();
    var value = 0;
    var response = panasonicParseResponse(cmd);
    if (response != null)
    {
        if ((response.length >= 6) && (response[0] == 0xC0) && (response[5] == 0xFF))
        {
            value = response[3];
        }
    }

    return value;
}

function panasonicSetSDCmd(value) {
    var datas = new Array();
    datas[0] = 0xA0;
    datas[1] = 0x06;
    datas[2] = 0x20;
    datas[3] = value;
    return panasonicMkCmd(datas);
}

function panasonicGetColorMaxGainCmd() {
    var datas = new Array();
    datas[0] = 0x80;
    datas[1] = 0x0A;
    datas[2] = 0x09;
    return panasonicMkCmd(datas);
}

function panasonicGetColorMaxGain() {
    var cmd = panasonicGetColorMaxGainCmd();
    var value = 0;
    var response = panasonicParseResponse(cmd);
    if (response != null)
    {
        if ((response.length >= 6) && (response[0] == 0xC0) && (response[5] == 0xFF))
        {
            value = response[3];
        }
    }

    return value;
}

function panasonicSetColorMaxGainCmd(value) {
    var datas = new Array();
    datas[0] = 0xA0;
    datas[1] = 0x0A;
    datas[2] = 0x00;
    datas[3] = value;
    return panasonicMkCmd(datas);
}

function panasonicGetBWMaxGainCmd() {
    var datas = new Array();
    datas[0] = 0x80;
    datas[1] = 0x0A;
    datas[2] = 0x0A;
    return panasonicMkCmd(datas);
}

function panasonicGetBWMaxGain() {
    var cmd = panasonicGetBWMaxGainCmd();
    var value = 0;
    var response = panasonicParseResponse(cmd);
    if (response != null)
    {
        if ((response.length >= 6) && (response[0] == 0xC0) && (response[5] == 0xFF))
        {
            value = response[3];
        }
    }

    return value;
}

function panasonicSetBWMaxGainCmd(value) {
    var datas = new Array();
    datas[0] = 0xA0;
    datas[1] = 0x0A;
    datas[2] = 0x01;
    datas[3] = value;
    return panasonicMkCmd(datas);
}

function panasonicGetAutoMaxGainCmd() {
    var datas = new Array();
    datas[0] = 0x80;
    datas[1] = 0x0A;
    datas[2] = 0x0B;
    return panasonicMkCmd(datas);
}

function panasonicGetAutoMaxGain() {
    var cmd = panasonicGetAutoMaxGainCmd();
    var value = 0;
    var response = panasonicParseResponse(cmd);
    if (response != null)
    {
        if ((response.length >= 6) && (response[0] == 0xC0) && (response[5] == 0xFF))
        {
            value = response[3];
        }
    }

    return value;
}

function panasonicSetAutoMaxGainCmd(value) {
    var datas = new Array();
    datas[0] = 0xA0;
    datas[1] = 0x0A;
    datas[2] = 0x02;
    datas[3] = value;
    return panasonicMkCmd(datas);
}

function panasonicGetMultiBLCWeightCmd() {
    var datas = new Array();
    datas[0] = 0x80;
    datas[1] = 0x06;
    datas[2] = 0x06;
    return panasonicMkCmd(datas);
}

function panasonicGetMultiBLCWeight() {
    var cmd = panasonicGetMultiBLCWeightCmd();
    var value = 0;
    var response = panasonicParseResponse(cmd);
    if (response != null)
    {
        if ((response.length >= 6) && (response[0] == 0xC0) && (response[5] == 0xFF))
        {
            value = response[3];
        }
    }

    return value;
}

function panasonicSetMultiBLCWeightCmd(value) {
    var datas = new Array();
    datas[0] = 0xA0;
    datas[1] = 0x06;
    datas[2] = 0x06;
    datas[3] = value;
    return panasonicMkCmd(datas);
}

function panasonicGetMultiBLCBrightCmd() {
    var datas = new Array();
    datas[0] = 0x80;
    datas[1] = 0x06;
    datas[2] = 0x09;
    return panasonicMkCmd(datas);
}

function panasonicGetMultiBLCBright() {
    var cmd = panasonicGetMultiBLCBrightCmd();
    var value = 0;
    var response = panasonicParseResponse(cmd);
    if (response != null)
    {
        if ((response.length >= 6) && (response[0] == 0xC0) && (response[5] == 0xFF))
        {
            value = response[3];
        }
    }

    return value;
}

function panasonicSetMultiBLCBrightCmd(value) {
    var datas = new Array();
    datas[0] = 0xA0;
    datas[1] = 0x06;
    datas[2] = 0x09;
    datas[3] = value;
    return panasonicMkCmd(datas);
}

function panasonicSetBLCCmd(value) {
    var datas = new Array();
    datas[0] = 0xA0;
    datas[1] = 0x06;
    datas[2] = value;

    switch (value) {
	case 2:
		datas[2] = 0x0B;
		break;
	case 3:
		datas[2] = 0x15;
		break;
	default:
		break;
    }

    return panasonicMkCmd(datas);
}

function panasonicGetStatus1Cmd() {
    var datas = new Array();
    datas[0] = 0x80;
    datas[1] = 0x4A;
    datas[2] = 0x01;
    return panasonicMkCmd(datas);
}

function panasonicGetDayNight() {
    var cmd = panasonicGetStatus1Cmd();
    var value = 0;
    var response = panasonicParseResponse(cmd);
    if (response != null)
    {
        if ((response.length >= 11) && (response[0] == 0xC0) && (response[10] == 0xFF))
        {
            if (((response[5] >> 3) & 0x01) == 1)
            {
               value = 2;
            }
            else
            {
               value = (response[5] >> 4) & 0x01;
            }
        }
    }

    return value;
}

function panasonicSetDayNightCmd(value) {
    var datas = new Array();
    datas[0] = 0xA0;
    datas[1] = 0x28;
    datas[2] = value;
    return panasonicMkCmd(datas);
}

function panasonicGetStatus4Cmd() {
    var datas = new Array();
    datas[0] = 0x80;
    datas[1] = 0x4A;
    datas[2] = 0x04;
    return panasonicMkCmd(datas);
}

function panasonicGetAperture() {
    var cmd = panasonicGetStatus4Cmd();
    var value = 0;
    var response = panasonicParseResponse(cmd);
    if (response != null)
    {
        if ((response.length >= 13) && (response[0] == 0xC0) && (response[12] == 0xFF))
        {
            value = (response[5] >> 3) & 0x01;
        }
    }

    return value;
}

function panasonicSetApertureCmd(value) {
    var datas = new Array();
    datas[0] = 0xA0;
    datas[1] = 0x0B;
    datas[2] = value;
    return panasonicMkCmd(datas);
}

function panasonicGetBLC() {
    var cmd = panasonicGetStatus4Cmd();
    var value = 0;
    var response = panasonicParseResponse(cmd);
    if (response != null)
    {
        if ((response.length >= 13) && (response[0] == 0xC0) && (response[12] == 0xFF))
        {
            value = (response[4] >> 2) & 0x03;
        }
    }

    return value;
}

function panasonicGetIrisMode() {
    var cmd = panasonicGetStatus4Cmd();
    var value = 0;
    var response = panasonicParseResponse(cmd);
    if (response != null)
    {
        if ((response.length >= 13) && (response[0] == 0xC0) && (response[12] == 0xFF))
        {
            value = response[4] & 0x03;
            if (value == 0)
            {
                value = (response[4] >> 4) & 0x07;
                if (value == 1)
                {
                    return 0;
                }
                else
                {
                    value++;
                }
            }
        }
    }

    return value;
}

function panasonicGetFocusMode() {
    var cmd = panasonicGetStatus1Cmd();
    var value = 0;
    var response = panasonicParseResponse(cmd);
    if (response != null)
    {
        if ((response.length >= 11) && (response[0] == 0xC0) && (response[10] == 0xFF))
        {
            value = response[5] & 0x03;
        }
    }

    return value;
}
