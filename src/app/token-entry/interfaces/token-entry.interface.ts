import { FormControl } from '@angular/forms';

export interface TokenValidationResponse {
  viewer: {
    __typename: string;
    login: string;
  };
}

export interface TokenEntry {
  token: FormControl<string | null>;
}
