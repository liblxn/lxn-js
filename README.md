# lxn-js
`lxn-go` is an [lxn](https://github.com/liblxn/lxn) client library for the Javascript programming language.

## Translating Text
To translate text, a catalog has to be loaded:
```ts
function readCatalog(buf: BufferSource): Translator
```
This function reads a binary catalog from `buf`, which could either be an [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) or an [`ArrayBufferView`](https://developer.mozilla.org/en-US/docs/Web/API/ArrayBufferView), and returns its translator function. Once a translator function of type
```ts
type Translator = (key: string, ctx: Context) => string;
```
is obtained, it can be used to convert a key and a context into a message. The key specifies the message key within the catalog preceded by its section, i.e. `section.message-key` (or simply `message-key` if the message has no section). The context contains all the necessary variables to render this message correctly. For each variable in the catalog there has to be a value of the corresponding type.
