// <div>
//   <form onSubmit={(e) => e.preventDefault()}>
//     {currentStep === 1 && (
//       <div>
//         <h2>Step 1: Personal Information</h2>
//         <input
//           type="text"
//           placeholder="Name"
//           value={formData.name}
//           onChange={(e) => updateFormData({ name: e.target.value })}
//         />
//         <input
//           type="date"
//           placeholder="Date of Birth"
//           value={formData.dateOfBirth}
//           onChange={(e) => updateFormData({ dateOfBirth: e.target.value })}
//         />
//         <input
//           type="text"
//           placeholder="Country"
//           value={formData.country}
//           onChange={(e) => updateFormData({ country: e.target.value })}
//         />
//         <input
//           type="text"
//           placeholder="State"
//           value={formData.state}
//           onChange={(e) => updateFormData({ state: e.target.value })}
//         />
//         <input
//           type="text"
//           placeholder="Username"
//           value={formData.username}
//           onChange={(e) => updateFormData({ username: e.target.value })}
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={(e) => updateFormData({ email: e.target.value })}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={(e) => updateFormData({ password: e.target.value })}
//         />
//         <input
//           type="password"
//           placeholder="Confirm Password"
//           value={formData.confirmPassword}
//           onChange={(e) =>
//             updateFormData({ confirmPassword: e.target.value })
//           }
//         />
//       </div>
//     )}

//     {currentStep === 2 && (
//       <div>
//         <h2>Step 2: Address</h2>
//         <input
//           type="text"
//           placeholder="Country"
//           value={formData.country}
//           onChange={(e) => updateFormData({ country: e.target.value })}
//         />
//         <input
//           type="text"
//           placeholder="State"
//           value={formData.state}
//           onChange={(e) => updateFormData({ state: e.target.value })}
//         />
//       </div>
//     )}

//     {currentStep === 3 && (
//       <div>
//         <h2>Step 3: Account Details</h2>
//         <input
//           type="text"
//           placeholder="Username"
//           value={formData.username}
//           onChange={(e) => updateFormData({ username: e.target.value })}
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={(e) => updateFormData({ email: e.target.value })}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={(e) => updateFormData({ password: e.target.value })}
//         />
//         <input
//           type="password"
//           placeholder="Confirm Password"
//           value={formData.confirmPassword}
//           onChange={(e) =>
//             updateFormData({ confirmPassword: e.target.value })
//           }
//         />
//       </div>
//     )}

//     <div>
//       {currentStep > 1 && (
//         <button type="button" onClick={handleBack}>
//           Back
//         </button>
//       )}
//       {currentStep < 3 && (
//         <button type="button" onClick={handleNext}>
//           Next
//         </button>
//       )}
//       {currentStep === 3 && (
//         <button type="button" onClick={handleSubmit}>
//           Confirm
//         </button>
//       )}
//     </div>
//   </form>
// </div>
