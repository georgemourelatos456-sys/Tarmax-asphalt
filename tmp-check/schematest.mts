import { quoteSchema } from "../src/lib/validation";
const cases: Record<string, unknown>[] = [
  { propertyAddress: "123 Elbow Drive SW, Calgary", fullName: "Jane Doe", phone: "403-605-3511" },
  { propertyAddress: "123 Elbow Drive SW, Calgary", fullName: "Jane Doe", phone: "(587) 897 0566" },
  { propertyAddress: "123 Elbow Drive SW, Calgary", fullName: "Jane Doe", phone: "", email: "a@b.com" },
  { propertyAddress: "123 Elbow Drive SW, Calgary", fullName: "Jane Doe", phone: "", email: "" },
  { propertyAddress: "123 Elbow Drive SW, Calgary", fullName: "Jane Doe", phone: "403-605-3511", email: "", message: "", company: "" },
];
for (const c of cases) {
  const r = quoteSchema.safeParse(c);
  console.log(JSON.stringify(c), "=>", r.success ? "OK" : JSON.stringify(r.error.issues.map((i) => [i.path.join("."), i.message])));
}
