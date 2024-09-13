import whizz from "../dist/index.js";

const async = async () => {
  const data = await whizz
    .get("https://jsonplaceholder.typicode.com/posts/1", {
      secure: false,
    })
    .then((res) => res.json());

  console.log(data);
};

async();
