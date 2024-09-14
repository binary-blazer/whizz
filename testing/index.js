import whizz from "../dist/index.js";

const async = async () => {
  const data = await whizz
    .get("http://localhost:3000/json", { secure: false });

  console.log(data);
};

async();
