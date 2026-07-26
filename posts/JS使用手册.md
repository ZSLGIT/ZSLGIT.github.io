

## 判断中英文长度
中文单字显示长度为2，英文单字显示长度为1，如直接使用length判断，对中文比较好，对英文会导致显示的少

```bash
const truncateByWidth = (str, maxWidth = 14) => {
  let width = 0;
  let index = 0;
  
  for (let i = 0; i < str.length; i++) {
    width += /[\u4e00-\u9fa5]/.test(str[i]) ? 2 : 1;
    if (width > maxWidth) break;
    index = i + 1;
  }
  
  return index < str.length ? str.slice(0, index) + '...' : str;
};

const getDisplayWidth = (str) => {
  let width = 0;
  for (let char of str) {
    // 判断是否为中文字符（包括中文标点）
    width += /[\u4e00-\u9fa5]/.test(char) ? 2 : 1;
  }
  return width;
};
```

## 相关文档

- [test 测试文档](posts/JS/test.md)
