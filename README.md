<div align="center">
  <picture>
      <img src="/assets/logo.png" width="25%" style="max-width: 75%;">
  </picture>
  <p>Whizz is a lightweight http client built on top of http for pure efficiency and speed</p>

  <p align="center">
  <a aria-label="NPM version" href="https://www.npmjs.com/package/whizz">
    <img alt="" src="https://img.shields.io/npm/v/whizz.svg?style=for-the-badge&labelColor=0e0a07">
  </a>
  <a aria-label="Size" href="https://www.npmjs.com/package/whizz">
    <img alt="" src="https://img.shields.io/npm/unpacked-size/whizz?style=for-the-badge&labelColor=0e0a07">
  </a>
  <a aria-label="NPM Downloads" href="https://www.npmjs.com/package/whizz">
    <img alt="" src="https://img.shields.io/npm/dt/whizz.svg?style=for-the-badge&labelColor=0e0a07">
  </a>
    <a aria-label="License" href="https://www.npmjs.com/package/whizz">
    <img alt="" src="https://img.shields.io/npm/l/whizz?style=for-the-badge&labelColor=0e0a07">
    </a>
</p>
</div>

## Installation
To install Whizz:
```sh
npm install whizz
# or
yarn add whizz
# or
pnpm install whizz
```

## Usage
Here are some examples of how to use Whizz:

### GET Request
```js
import whizz from 'whizz';

async function fetchData() {
  const response = await whizz.get('https://jsonplaceholder.typicode.com/posts/1', { secure: true, timeout: 2000 });
  const data = response.json();
  console.log(data);

}

fetchData();
```

<img src="/assets/get.png" width="100%" style="max-width: 100%;">

### POST Request
```js
import whizz from 'whizz';

async function postData() {
  const response = await whizz.post('https://jsonplaceholder.typicode.com/posts', {
    title: 'foo',
    body: 'bar',
    userId: 1,
  }, { secure: false }); 
  
  const data = response.json();
  console.log(data);
}

postData();
```

<img src="/assets/post.png" width="100%" style="max-width: 100%;">

## API Documentation
### `get(url: string, options?: RequestOptions): Promise<Response>`
Makes a GET request to the specified URL.

### `post(url: string, data: any, options?: RequestOptions): Promise<Response>`
Makes a POST request to the specified URL with the provided data.

### `put(url: string, data: any, options?: RequestOptions): Promise<Response>`
Makes a PUT request to the specified URL with the provided data.

### `delete(url: string, options?: RequestOptions): Promise<Response>`
Makes a DELETE request to the specified URL.

### `patch(url: string, options?: RequestOptions): Promise<Response>`
Makes a PATCH request to the specified URL.

### `head(url: string, options?: RequestOptions): Promise<Response>`
Makes a HEAD request to the specified URL.

### `options(url: string, options?: RequestOptions): Promise<Response>`
Makes an OPTIONS request to the specified URL.

### `trace(url: string, options?: RequestOptions): Promise<Response>`
Makes a TRACE request to the specified URL.

### `connect(url: string, options?: RequestOptions): Promise<Response>`
Makes a CONNECT request to the specified URL.

## Contributing
Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) for more information.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for details.