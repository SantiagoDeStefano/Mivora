// import * as yup from "yup";

// // --- SCHEMAS ---

// export const authSchema = yup.object({
//   email: yup
//     .string()
//     .required('Email is required')
//     .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, 'Email must be a valid Google email address')
//     .min(5, 'Email must be between 5 - 160 characters')
//     .max(160, 'Email must be between 5 - 160 characters'),
//   password: yup
//     .string()
//     .required('Password is required')
//     .min(6, 'Password must be at least 6 - 160 characters')
//     .max(160, 'Password must be at least 6 - 160 characters'),
//   confirm_password: yup
//     .string()
//     .required('Password confirmation is required')
//     .min(6, 'Password must be at least 6 - 160 characters')
//     .max(160, 'Password must be at least 6 - 160 characters')
//     .oneOf([yup.ref('password')], 'Passwords do not match')
// });

// export const priceSchema = yup.object({
//   price_min: yup
//     .string()
//     .default("")
//     .test({
//       name: "price-range",
//       message: "Invalid price range",
//       test(value) {
//         const min = (value ?? "").trim();
//         const max = (this.parent.price_max ?? "").trim();
//         if (min === "" && max === "") return false;
//         if (min !== "" && !/^\d+$/.test(min)) return false;
//         if (max !== "" && !/^\d+$/.test(max)) return false;
//         if (min !== "" && max !== "") {
//           return Number(min) <= Number(max);
//         }
//         return true;
//       },
//     }),
//   price_max: yup
//     .string()
//     .default("")
//     .test({
//       name: "price-range",
//       message: "Invalid price range",
//       test(value) {
//         const min = (this.parent.price_min ?? "").trim();
//         const max = (value ?? "").trim();
//         if (min === "" && max === "") return false;
//         if (min !== "" && !/^\d+$/.test(min)) return false;
//         if (max !== "" && !/^\d+$/.test(max)) return false;
//         if (min !== "" && max !== "") {
//           return Number(min) <= Number(max);
//         }
//         return true;
//       },
//     }),
// });

// export const eventTitleSchema = yup.object({
//   title: yup
//     .string()
//     .trim()
//     .required("Event title is required.")
//     .min(3, "Title must be at least 3 characters")
//     .max(120, "Title must be at most 120 characters"),
// });


// // --- TYPES ---
// export type AuthSchema = yup.InferType<typeof authSchema>;
// export type PriceSchema = yup.InferType<typeof priceSchema>;
// export type EventTitleSchema = yup.InferType<typeof eventTitleSchema>;
