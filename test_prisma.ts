import { prisma } from "./lib/db";

async function run() {
  const t = await prisma.task.findFirst({
    orderBy: { createdAt: "desc" }
  });
  if (!t) return console.log("No tasks");
  console.log("DB Date:", t.date);
  console.log("getTime:", t.date.getTime());
  console.log("ISO:", t.date.toISOString());
  
  // local representation in JS 
  console.log("toString:", t.date.toString());
}
run();
