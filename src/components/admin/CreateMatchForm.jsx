import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { PlusCircle, Calendar, Percent, ShieldCheck } from "lucide-react";
import Select from "react-select";
import flags from "country-flag-emoji-json";
import Input from "../common/Input";
import Button from "../common/Button";

const fifaCountries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia",
  "Bosnia & Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon",
  "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo - Brazzaville", "Congo - Kinshasa",
  "Costa Rica", "Croatia", "Cuba", "Curaçao", "Cyprus", "Czechia", "Côte d’Ivoire", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "England", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji",
  "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea",
  "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong SAR China", "Hungary", "Iceland", "India", "Indonesia", "Iran",
  "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kosovo", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macao SAR China",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mauritania", "Mauritius", "Mexico", "Moldova", "Mongolia",
  "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar (Burma)", "Namibia", "Nepal", "Netherlands", "New Zealand",
  "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Northern Ireland", "Norway", "Oman", "Pakistan",
  "Palestinian Territories", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico",
  "Qatar", "Romania", "Russia", "Rwanda", "Samoa", "San Marino", "Saudi Arabia", "Scotland", "Senegal", "Serbia", "Seychelles",
  "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan",
  "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "São Tomé & Príncipe", "Tajikistan", "Tanzania",
  "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad & Tobago", "Tunisia", "Turkey", "Turkmenistan", "Uganda", "Ukraine",
  "United Arab Emirates", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Wales", "Yemen",
  "Zambia", "Zimbabwe"
];

const countryOptions = [];
flags.forEach(f => {
  if (fifaCountries.includes(f.name)) {
    // Add official name
    countryOptions.push({
      value: f.emoji,
      label: f.name,
      image: f.image,
      countryName: f.name
    });
    
    // Add aliases
    if (f.name === "Côte d’Ivoire") {
      countryOptions.push({
        value: f.emoji,
        label: "Ivory Coast",
        image: f.image,
        countryName: "Ivory Coast"
      });
    } else if (f.name === "Cape Verde") {
      countryOptions.push({
        value: f.emoji,
        label: "Cabo Verde",
        image: f.image,
        countryName: "Cabo Verde"
      });
    } else if (f.name === "Congo - Kinshasa") {
      countryOptions.push({
        value: f.emoji,
        label: "DR Congo",
        image: f.image,
        countryName: "DR Congo"
      });
      countryOptions.push({
        value: f.emoji,
        label: "Democratic Republic of the Congo",
        image: f.image,
        countryName: "Democratic Republic of the Congo"
      });
    } else if (f.name === "Curaçao") {
      countryOptions.push({
        value: f.emoji,
        label: "Curacao",
        image: f.image,
        countryName: "Curacao"
      });
    }
  }
});

// Sort the options alphabetically by label
countryOptions.sort((a, b) => a.label.localeCompare(b.label));

const selectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "rgb(30, 41, 59)", // bg-card-dark roughly
    borderColor: state.isFocused ? "#3b82f6" : "rgba(255, 255, 255, 0.1)",
    borderRadius: "0.75rem", // rounded-xl
    padding: "0.25rem",
    boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
    "&:hover": {
      borderColor: state.isFocused ? "#3b82f6" : "rgba(255, 255, 255, 0.2)"
    }
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "rgb(30, 41, 59)",
    borderRadius: "0.75rem",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    zIndex: 50
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "rgba(255, 255, 255, 0.1)" : "transparent",
    color: "white",
    cursor: "pointer",
    "&:active": {
      backgroundColor: "rgba(255, 255, 255, 0.15)"
    }
  }),
  singleValue: (base) => ({
    ...base,
    color: "white"
  }),
  input: (base) => ({
    ...base,
    color: "white"
  })
};

const CreateMatchForm = ({ onSubmitSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      teamA: "",
      teamAFlag: "🇦🇷",
      teamB: "",
      teamBFlag: "🇫🇷",
      matchDateTime: "",
      predictionClosingTime: "",
      perfectScorePoint: 2,
      winnerOnlyPoint: 1
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError("");
    try {
      // Auto fill predictionClosingTime if left blank
      if (!data.predictionClosingTime && data.matchDateTime) {
        // Default to 30 mins before kickoff
        const kickOff = new Date(data.matchDateTime);
        const closing = new Date(kickOff.getTime() - 30 * 60 * 1000);
        data.predictionClosingTime = closing.toISOString();
      } else if (data.predictionClosingTime) {
        data.predictionClosingTime = new Date(data.predictionClosingTime).toISOString();
      }

      if (data.matchDateTime) {
        data.matchDateTime = new Date(data.matchDateTime).toISOString();
      }

      await onSubmitSuccess(data);
      reset();
    } catch (err) {
      setServerError(err.message || "Failed to create match fixture");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 text-left text-white light:text-bg-dark">
      {serverError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl text-xs font-semibold leading-relaxed">
          {serverError}
        </div>
      )}

      {/* Team A Selection Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label="Team A Name"
            placeholder="e.g. Argentina"
            error={errors.teamA?.message}
            {...register("teamA", { required: "Team A name is required" })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary-dark font-display">
            Team A Country & Flag
          </label>
          <Controller
            name="teamAFlag"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={countryOptions}
                styles={selectStyles}
                classNamePrefix="react-select"
                placeholder="Search country..."
                formatOptionLabel={(option) => (
                  <div className="flex items-center gap-2">
                    <img src={option.image} alt={option.label} className="w-6 h-4 object-cover rounded-sm shadow-[0_0_2px_rgba(0,0,0,0.5)]" />
                    <span>{option.label}</span>
                  </div>
                )}
                value={countryOptions.find(c => c.value === field.value) || null}
                onChange={(selectedOption) => {
                  field.onChange(selectedOption ? selectedOption.value : "");
                  if (selectedOption) {
                    setValue("teamA", selectedOption.countryName);
                  }
                }}
              />
            )}
          />
        </div>
      </div>

      {/* Team B Selection Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label="Team B Name"
            placeholder="e.g. France"
            error={errors.teamB?.message}
            {...register("teamB", { required: "Team B name is required" })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary-dark font-display">
            Team B Country & Flag
          </label>
          <Controller
            name="teamBFlag"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={countryOptions}
                styles={selectStyles}
                classNamePrefix="react-select"
                placeholder="Search country..."
                formatOptionLabel={(option) => (
                  <div className="flex items-center gap-2">
                    <img src={option.image} alt={option.label} className="w-6 h-4 object-cover rounded-sm shadow-[0_0_2px_rgba(0,0,0,0.5)]" />
                    <span>{option.label}</span>
                  </div>
                )}
                value={countryOptions.find(c => c.value === field.value) || null}
                onChange={(selectedOption) => {
                  field.onChange(selectedOption ? selectedOption.value : "");
                  if (selectedOption) {
                    setValue("teamB", selectedOption.countryName);
                  }
                }}
              />
            )}
          />
        </div>
      </div>

      {/* Kickoff & Closing Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label="Kickoff Date & Time"
            type="datetime-local"
            error={errors.matchDateTime?.message}
            startIcon={<Calendar className="w-4 h-4 text-text-secondary-dark" />}
            {...register("matchDateTime", { required: "Match kickoff time is required" })}
          />
        </div>
        <div>
          <Input
            label="Prediction Closing Time"
            type="datetime-local"
            startIcon={<Calendar className="w-4 h-4 text-text-secondary-dark" />}
            placeholder="Defaults to 30 mins before kickoff"
            {...register("predictionClosingTime")}
          />
          <span className="text-[10px] text-text-secondary-dark mt-1 block">
            Leave blank to auto-lock 30 minutes before kickoff.
          </span>
        </div>
      </div>

      {/* Points settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label="Perfect Score Points"
            type="number"
            error={errors.perfectScorePoint?.message}
            startIcon={<ShieldCheck className="w-4 h-4 text-text-secondary-dark" />}
            {...register("perfectScorePoint", {
              required: "Required",
              min: { value: 1, message: "Must be >= 1" }
            })}
          />
        </div>
        <div>
          <Input
            label="Winner Only Points"
            type="number"
            error={errors.winnerOnlyPoint?.message}
            startIcon={<Percent className="w-4 h-4 text-text-secondary-dark" />}
            {...register("winnerOnlyPoint", {
              required: "Required",
              min: { value: 1, message: "Must be >= 1" }
            })}
          />
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        loading={loading}
        className="w-full py-3.5 uppercase tracking-wider font-bold text-sm mt-3"
        endIcon={<PlusCircle className="w-4 h-4" />}
      >
        Add Match Fixture
      </Button>
    </form>
  );
};

export default CreateMatchForm;
