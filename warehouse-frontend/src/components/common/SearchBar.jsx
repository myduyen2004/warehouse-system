import { TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';

const SearchBar = ({
  value,
  onChange,
  placeholder = 'Search...',
  fullWidth = true,
}) => {
  return (
    <TextField
      fullWidth={fullWidth}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchBar;