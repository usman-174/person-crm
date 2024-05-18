import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  City,
  Country,
  ICity,
  ICountry,
  IState,
  State,
} from "country-state-city";
import { useState } from "react";

type Props = {
  form: any;
};

const CountriesSelect = ({ form }: Props) => {
  const countries: ICountry[] = Country.getAllCountries();

  const [states, setStates] = useState<IState[]>(
    form.getValues().country
      ? State.getStatesOfCountry(form.getValues().country)
      : []
  );
  const [cities, setCities] = useState<ICity[]>(
    form.getValues().state
      ? City.getCitiesOfState(form.getValues().country, form.getValues().state)
      : []
  );
  return (
    <div className="flex items-center gap-5 flex-wrap sm:flex-nowrap md:justify-between ">
      <FormField
        control={form.control}
        name="country"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>Country</FormLabel>
            <Select
              onValueChange={(e) => {
                field.onChange(e);
                setStates(State.getStatesOfCountry(e));
              }}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a Country" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="state"
        disabled={
          !form.getValues().country || form.getValues().country !== "US"
        }
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>State</FormLabel>

            <Select
              onValueChange={(e) => {
                field.onChange(e);
                setCities(City.getCitiesOfState(form.getValues().country!, e));
              }}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a State" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {form.getValues().country === "US"
                  ? states.map((state) => (
                      <SelectItem key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </SelectItem>
                    ))
                  : //   <SelectItem value="x">No States</SelectItem>
                    null}
              </SelectContent>
            </Select>

            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="city"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>City</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a City" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.name} value={city.name}>{city.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </div>
  );
};

export default CountriesSelect;
