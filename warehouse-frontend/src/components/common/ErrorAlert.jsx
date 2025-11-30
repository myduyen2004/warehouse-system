import { Alert, AlertTitle, Box, Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';

const ErrorAlert = ({
  title = 'Error',
  message = 'Something went wrong. Please try again.',
  onRetry,
}) => {
  return (
    <Box sx={{ p: 2 }}>
      <Alert severity="error">
        <AlertTitle>{title}</AlertTitle>
        {message}
        {onRetry && (
          <Box sx={{ mt: 2 }}>
            <Button
              size="small"
              startIcon={<Refresh />}
              onClick={onRetry}
              variant="outlined"
              color="error"
            >
              Retry
            </Button>
          </Box>
        )}
      </Alert>
    </Box>
  );
};

export default ErrorAlert;