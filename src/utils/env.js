import jsrsasign from 'jsrsasign';
import lance from './lance';
/**
 * 是否为开发环境
 * @returns {Boolean}
 */
export function isDev() {
  return import.meta.env.DEV;
}

/**
 * 是否为生产环境
 * @returns {Boolean}
 */
export function isProd() {
  return import.meta.env.PROD;
}

// 利用SHA256withRSA进行加密
export const RsaSign = (data, nonceStr, timestamp) => {
  data = JSON.stringify(data);
  const userId = lance.getData('token');
  const JsonStr = `body=${data}&nonceStr=${nonceStr}&timestamp=${timestamp}&userId=${userId}`;
  // console.log(JsonStr, 'JsonStr');
  const k = `-----BEGIN PRIVATE KEY-----
  MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCiesp3vqLa1Sbe
  2vK05B/ebZuI30/2r4OIdIyJXlDtDrVleK4SqqDXWhdO3hjRRWYUOKgJ9rEN0zCG
  AaHZ+i4i/SECt4ONpXuUGTD9eud4L71OerD/X8+ctmamOnE1RZ8hJH1B2mq7LjZa
  It+ixU+hAxokusGFSqvOkMxbutByeoQk9Q4RsxQSLLLalfMYqJb+i2IYPm3COAxI
  c/b1PGwR3BaWLK0Lgrl13+E0GVJPJDw/ElA8G8rkPISlSTs8TlceNB5pvToMiZuj
  awZJV20w2IibakEx38h8FM+NDnVLd8ntZLNEMsQjiQYmviCVa2eyeCT+87ipjlA9
  djppOhOrAgMBAAECggEBAIvNZ8TczTfJy+ZZMhifaSRz3y5IJ3+0yVJyJjJUawFu
  dHpY+j6pfjeOFxwPUf9O3WRs03mvP+0LWGcVpHPwJh6I+wxhZtpMFyb4/gQ86kmp
  mhOa0g0KHZNUBsLk6l/SBff4c6ZkDw3711x7QT3G1JtQFgCgiL7t3yKfyJbtCUpV
  7YqC1vG83h6uuzJ4gbOr6hwg2ZnYrU2nFAxk1rHK53K30NEnacV8tbl4qf5cTsuY
  bIQNPh+1sd/ld8b7Au+brAENKqm8zT2s9b9qV2gv8tuLZShWNkwy5rYJ9DhoDlbL
  2cgiurhgnphZMOAPsUA7IUFn8s4BvJh5y2nNzF142xECgYEA0zJA3GM4b/H6z8Tn
  HAPfol6T06Qekr0VcBWyTChOR4IRyBy08NGtBWRe1HsIjVCm8oMB2xdmdcvb4XV5
  1PB+ij1XGYrkebb2zOzsZykWvi5dTsf04of88vB4Cx8ztSRYaiAeImJ7whCwqIY/
  QUXVEaJBt/R5xgLIE/y1AQAUsRUCgYEAxPLPpO02BuxWV6ATcQ16RcTvVOBlzw+J
  6Q9HRNexAQs9e9KjPZjuvU+EI6Keiucx06bmmYe7RbmrwTFgmfAvvMSQ4OuPgrfA
  IrTuuVYiU2Fjty42UWfO5ncrzng0OhabGYHpljKEd2xhXNTRot5A74Gs2bu58DVE
  qRnvE1otYb8CgYEAxcPEGtvKiIFGhPJ0G7bA3nHD6aZAftYS0g9vE4OWsb1p20KO
  aQdfBrKTXlMLkhDZFDR7M2b5KgtIjhoMiMrfI6IHAsMd6Z/cAc9GG9/NDS+rbk8t
  0EbZJcDqGDgSmmg7Zr1GmpowG2y3kEeNyhiTSdzvv0tuEG6gXp7/+7zQo3UCgYBh
  qhMEM0mOZ1Ztv4jEkC1pOb6BNYHnC0qVUylBX0B8RwmnRI4Etrj1EeByF2tNcFaK
  IYLK8b8RVYBxnj3MOIpDrqo1jzqsVNinnVegerEs7eeX6AexmKvGJ6SGj58+iwVA
  weaGv+hmnE0vzq1ieZpz6rc/hdMv5gp1XNHso9RLWwKBgQC8NBi55r1EhTwM24XP
  acUJK9OgbMzmY4f7VHb9dtVN2VtEoK8uCo8DWWbXo+UNUfIafykPkt93Nl/haGCz
  GrX7ibuAnua6ppF/95OI9t5VC7D+a4HneZBrbFrfnovCim9tBBKjVRJWj/hefjNj
  kQa9aJZO5AfSwRDwEkMNaKmLdA==
  -----END PRIVATE KEY-----`;
  const rsa = jsrsasign.KEYUTIL.getKey(k);
  const sig = new jsrsasign.KJUR.crypto.Signature({ alg: 'SHA256withRSA' });
  sig.init(rsa);
  sig.updateString(JsonStr);
  const signResult = sig.sign();
  const signBase64 = jsrsasign.hextob64(signResult);
  return signBase64;
};

// 随机字符串 uuid
export const RandomString = (len, radix) => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  const uuid = [];
  let i;
  radix = radix || chars.length;
  if (len) {
    for (i = 0; i < len; i++) {
      uuid[i] = chars[0 | (Math.random() * radix)];
    }
  } else {
    let r;
    for (i = 0; i < radix; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join('');
};
// 获取当前时间戳
export const getlongTime = () => {
  return Date.parse(new Date()).toString();
};
