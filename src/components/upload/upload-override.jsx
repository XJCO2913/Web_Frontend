import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { m, AnimatePresence } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { UploadIllustration } from 'src/assets/illustrations';
import { varFade } from 'src/components/animate';

import Iconify from '../iconify';
import MultiFilePreview from './preview-multi-file';
import RejectionFiles from './errors-rejection-files';
import SingleFilePreview from './preview-single-file';

// ----------------------------------------------------------------------

export default function UploadOverride({
  disabled,
  multiple = false,
  error,
  helperText,
  //
  file,
  onDelete,
  //
  files,
  thumbnail,
  onPost,
  onRemove,
  onRemoveAll,
  onContent,
  isSuccess,
  loading,
  sx,
  ...other
}) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple,
    disabled,
    ...other,
  });

  const hasFile = !!file && !multiple;

  const hasFiles = !!files && multiple && !!files.length;

  const hasError = isDragReject || !!error;

  const renderPlaceholder = (
    <Stack spacing={3} alignItems="center" justifyContent="center" flexWrap="wrap">
      <UploadIllustration sx={{ width: 1, maxWidth: 200 }} />
      <Stack spacing={1} sx={{ textAlign: 'center' }}>
        <Typography variant="h6">Drop or Select file</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Drop or seleect photo/video or GPX files here thorough your devise
        </Typography>
      </Stack>
    </Stack>
  );

  const renderSinglePreview = (
    <SingleFilePreview imgUrl={typeof file === 'string' ? file : file?.preview} />
  );

  const removeSinglePreview = hasFile && onDelete && (
    <IconButton
      size="small"
      onClick={onDelete}
      sx={{
        top: 16,
        right: 16,
        zIndex: 9,
        position: 'absolute',
        color: (theme) => alpha(theme.palette.common.white, 0.8),
        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
        '&:hover': {
          bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
        },
      }}
    >
      <Iconify icon="mingcute:close-line" width={18} />
    </IconButton>
  );

  const renderMultiPreview = (
    <AnimatePresence>
      {(hasFiles || onContent !== '') && (
        <Stack
          component={m.div}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={varFade({ durationIn: 0.8, durationOut: 0.8, easeIn: "easeOut", easeOut: "easeInOut" }).inUp}
        >
          {hasFiles && (
            <Box sx={{ my: 3 }}>
              <MultiFilePreview files={files} thumbnail={thumbnail} onRemove={onRemove} />
            </Box>
          )}

          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={1.5}
            component={m.div}
            variants={varFade({ durationIn: 0.3, durationOut: 0.3, easeIn: "easeOut", easeOut: "easeInOut" }).inUp}
          >
            {hasFiles && onRemoveAll && (
              <Button color="inherit" variant="outlined" size="small" onClick={onRemoveAll} sx={{ mt: 1 }}>
                Remove All
              </Button>
            )}

            {!isSuccess && (hasFiles || onContent !== '') && (
              <LoadingButton
                size="small"
                variant="contained"
                onClick={onPost}
                startIcon={<Iconify icon="tabler:send" />}
                sx={{ mt: 1 }}
                loading={loading}
              >
                Post
              </LoadingButton>
            )}
          </Stack>
        </Stack>
      )}
    </AnimatePresence>
  );


  return (
    <Box sx={{ width: 1, position: 'relative', ...sx }}>
      <Box
        {...getRootProps()}
        sx={{
          p: 5,
          outline: 'none',
          borderRadius: 1,
          cursor: 'pointer',
          overflow: 'hidden',
          position: 'relative',
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
          border: (theme) => `1px dashed ${alpha(theme.palette.grey[500], 0.2)}`,
          transition: (theme) => theme.transitions.create(['opacity', 'padding']),
          '&:hover': {
            opacity: 0.72,
          },
          ...(isDragActive && {
            opacity: 0.72,
          }),
          ...(disabled && {
            opacity: 0.48,
            pointerEvents: 'none',
          }),
          ...(hasError && {
            color: 'error.main',
            borderColor: 'error.main',
            bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
          }),
          ...(hasFile && {
            padding: '24% 0',
          }),
        }}
      >
        <input {...getInputProps()} />

        {hasFile ? renderSinglePreview : renderPlaceholder}
      </Box>

      {removeSinglePreview}

      {helperText && helperText}

      <RejectionFiles fileRejections={fileRejections} />

      {renderMultiPreview}
    </Box>
  );
}

UploadOverride.propTypes = {
  disabled: PropTypes.object,
  error: PropTypes.bool,
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  files: PropTypes.array,
  helperText: PropTypes.object,
  multiple: PropTypes.bool,
  onDelete: PropTypes.func,
  onRemove: PropTypes.func,
  onRemoveAll: PropTypes.func,
  onPost: PropTypes.func,
  sx: PropTypes.object,
  thumbnail: PropTypes.bool,
  onContent: PropTypes.string,
  isSuccess: PropTypes.bool,
  loading: PropTypes.bool,
};
