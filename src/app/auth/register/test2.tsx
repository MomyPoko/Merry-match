<>
    <div className="h-full]">
      <div className="flex flex-col justify-center items-center">
        <div className="border-[2px] w-[65%] my-[34px] flex flex-col justify-center items-center gap-[80px]">
          <div className="w-full h-[145px] flex justify-between">
            <div className="flex flex-col">
              <div>REGISTER</div>
              <div className="w-[80%] text-[46px] text-purple-500 font-bold">
                Join us and start matching
              </div>
            </div>
            <div className="h-[80px] flex gap-[12px]">
              {currentStep === 1 ? (
                <>
                  <div className="border-[1px] border-purple-500 p-[16px_32px_16px_16px] rounded-[16px] flex items-center">
                    <div className="border-[1px] w-[48px] h-[48px] bg-gray-200 text-purple-500 text-[24px] font-700 rounded-[16px] flex justify-center items-center">
                      1
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="text-[12px]">Step 1/3</div>
                      <div>Basic Information</div>
                    </div>
                  </div>
                  <div className="border-[1px] border-purple-500 p-[16px] rounded-[16px] flex justify-center items-center">
                    <div className="border-[1px] w-[48px] h-[48px] bg-gray-200 text-purple-500 text-[24px] font-700 rounded-[16px] flex justify-center items-center">
                      2
                    </div>
                  </div>
                  <div className="border-[1px] border-purple-500 p-[16px] rounded-[16px] flex justify-center items-center">
                    <div className="border-[1px] w-[48px] h-[48px] bg-gray-200 text-purple-500 text-[24px] font-700 rounded-[16px] flex justify-center items-center">
                      3
                    </div>
                  </div>
                </>
              ) : currentStep === 2 ? (
                <>
                  <div className="border-[1px] border-purple-500 p-[16px] rounded-[16px] flex justify-center items-center">
                    <div className="border-[1px] w-[48px] h-[48px] bg-gray-200 text-purple-500 text-[24px] font-700 rounded-[16px] flex justify-center items-center">
                      1
                    </div>
                  </div>
                  <div className="border-[1px] border-purple-500 p-[16px_32px_16px_16px] rounded-[16px] flex items-center">
                    <div className="border-[1px] w-[48px] h-[48px] bg-gray-200 text-purple-500 text-[24px] font-700 rounded-[16px] flex justify-center items-center">
                      2
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="text-[12px]">Step 2/3</div>
                      <div>Identities and Interests</div>
                    </div>
                  </div>
                  <div className="border-[1px] border-purple-500 p-[16px] rounded-[16px] flex justify-center items-center">
                    <div className="border-[1px] w-[48px] h-[48px] bg-gray-200 text-purple-500 text-[24px] font-700 rounded-[16px] flex justify-center items-center">
                      3
                    </div>
                  </div>
                </>
              ) : currentStep === 3 ? (
                <>
                  <div className="border-[1px] border-purple-500 p-[16px] rounded-[16px] flex justify-center items-center">
                    <div className="border-[1px] w-[48px] h-[48px] bg-gray-200 text-purple-500 text-[24px] font-700 rounded-[16px] flex justify-center items-center">
                      1
                    </div>
                  </div>
                  <div className="border-[1px] border-purple-500 p-[16px] rounded-[16px] flex justify-center items-center">
                    <div className="border-[1px] w-[48px] h-[48px] bg-gray-200 text-purple-500 text-[24px] font-700 rounded-[16px] flex justify-center items-center">
                      2
                    </div>
                  </div>
                  <div className="border-[1px] border-purple-500 p-[16px_32px_16px_16px] rounded-[16px] flex items-center">
                    <div className="border-[1px] w-[48px] h-[48px] bg-gray-200 text-purple-500 text-[24px] font-700 rounded-[16px] flex justify-center items-center">
                      3
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="text-[12px]">Step 3/3</div>
                      <div>Upload Photos</div>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {currentStep === 1 && (
            <form
              onSubmit={(e) => e.preventDefault()}
              className="border-[1px] w-full flex flex-col gap-[24px]"
            >
              <div className="text-[24px] text-purple-500">
                Basic Information
              </div>
              <div className="w-full grid grid-cols-2 gap-[40px]">
                <InputField
                  label="Name"
                  placeholder="John Snow"
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData({ name: e.target.value })}
                />

                <InputField
                  label="Date of birth"
                  placeholder="01/01/2022"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateFormData({ dateOfBirth: e.target.value })}
                />

                <div className="flex flex-col gap-[4px]">
                  <label htmlFor="country">Country</label>
                  <select
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-[100%] h-[50px] border-[1px] border-[black] rounded-[8px]"
                  >
                    <option value="">Select Country</option>
                    {countries.map((countries) => (
                      <option key={countries.isoCode} value={countries.isoCode}>
                        {countries.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-[4px]">
                  <label htmlFor="state">State</label>
                  <select
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-[100%] h-[50px] border-[1px] border-[black] rounded-[8px]"
                    disabled={!country}
                  >
                    <option value="">Select State</option>
                    {states.map((states) => (
                      <option
                        key={${states.name}-${states.isoCode}}
                        value={states.name}
                      >
                        {states.name}
                      </option>
                    ))}
                  </select>
                </div>

                <InputField
                  label="Username"
                  placeholder="At least 6 characters"
                  type="text"
                  value={formData.username}
                  onChange={(e) => updateFormData({ username: e.target.value })}
                />

                <InputField
                  label="Email"
                  placeholder="name@website.com"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData({ email: e.target.value })}
                />

                <InputField
                  label="Password"
                  placeholder="At least 8 characters"
                  type="text"
                  value={formData.password}
                  onChange={(e) => updateFormData({ password: e.target.value })}
                />

                <InputField
                  label="Confirm password"
                  placeholder="At least 8 characters"
                  type="text"
                  value={formData.confirmPassword}
                  onChange={(e) =>updateFormData({ confirmPassword: e.target.value })}
                />
              </div>
            </form>
          )}
        </div>
      </div>

      {currentStep === 2 && (
        <form
          onSubmit={() => {}}
          className="border-[1px] w-full flex flex-col gap-[24px]"
        >
          <div className="text-[24px] text-purple-500">
            Identities and Interests
          </div>
         <div className="w-full grid grid-cols-2 gap-[40px]">
            <div className="flex flex-col gap-[4px]">
              <div>Sexual Identities</div>
              <select>
                <option value="">Sexual</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other...</option>
              </select>
            </div>

            <div className="flex flex-col gap-[4px]">
              <div>Sexual Identities</div>
              <select>
                <option value="">Sexual</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other...</option>
              </select>
            </div>

            <div className="flex flex-col gap-[4px]">
              <div>Sexual Identities</div>
              <select>
                <option value="">Sexual</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other...</option>
              </select>
            </div>

            <div className="flex flex-col gap-[4px]">
              <div>Sexual Identities</div>
              <select>
                <option value="">Sexual</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other...</option>
              </select>
            </div> 
          </div>
        </form>
      )}

      {currentStep === 3 && (
        <form
          onSubmit={() => {}}
          className="border-[1px] w-full flex flex-col gap-[24px]"
        >
          <div className="text-[24px] text-purple-500">Profile pictures</div>
          <div className="text-[24px] text-purple-500">
            Upload at least 2 photos
          </div>
        </form>
      )}

      {currentStep === 1 && (
        <div className="h-[112px] px-[200px] border-[1px] flex justify-between items-center">
          <div>1/3</div>
          <div>
            <button>Back</button>
            <button className="bg-red-500 p-[12px_24px_12px_24px] text-white rounded-[99px]">
              Next Step
            </button>
          </div>
        </div>
      )}
      {currentStep === 2 && (
        <div className="h-[112px] px-[200px] border-[1px] flex justify-between items-center">
          <div>2/3</div>
          <div>
            <button>Back</button>
            <button className="bg-red-500 p-[12px_24px_12px_24px] text-white rounded-[99px]">
              Next Step
            </button>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="h-[112px] px-[200px] border-[1px] flex justify-between items-center">
          <div>2/3</div>
          <div>
            <button>Back</button>
            <Link href="/login">
              <button className="bg-red-500 p-[12px_24px_12px_24px] text-white rounded-[99px]">
                Next Step
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>