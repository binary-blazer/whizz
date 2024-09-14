import whizz from "../dist/index.js";

const async = async () => {
  const data = await whizz
    .get("https://jsonplaceholder.typicode.com/posts/1", { secure: true })

  console.log(data);
};

async();
