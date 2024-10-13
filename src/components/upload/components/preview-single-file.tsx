import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

import type { IconButtonProps } from '@mui/material/IconButton';

import { Page, Document } from 'react-pdf';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from '../../iconify';
import { uploadClasses } from '../classes';

import type { SingleFilePreviewProps } from '../types';

// ----------------------------------------------------------------------

export function SingleFilePreview({ file, sx, className, ...other }: SingleFilePreviewProps) {
  const fileType = typeof file === 'string' ? file : file.type;

  const fileName = typeof file === 'string' ? file : file.name;

  const previewUrl = typeof file === 'string' ? file : URL.createObjectURL(file);

  return (
    <Box
      className={uploadClasses.uploadSinglePreview.concat(className ? ` ${className}` : '')}
      sx={{
        p: 1,
        top: 0,
        left: 0,
        width: 1,
        height: 1,
        position: 'absolute',
        ...sx,
      }}
      {...other}
    >
      {fileType !== 'application/pdf' && (
        <Box
          component="img"
          alt={fileName}
          src={previewUrl}
          sx={{
            width: 1,
            height: 1,
            borderRadius: 1,
            objectFit: 'cover',
          }}
        />
      )}

      {fileType === 'application/pdf' && (
        <Box
          sx={{
            width: 1,
            height: 1,
            borderRadius: 1,
            objectFit: 'cover',
            overflow: 'auto',
          }}
        >
          <Document file={file}>
            <Page pageNumber={1} />
          </Document>
        </Box>
      )}
    </Box>
  );
}

// ----------------------------------------------------------------------

export function DeleteButton({ sx, ...other }: IconButtonProps) {
  return (
    <IconButton
      size="small"
      sx={{
        top: 16,
        right: 16,
        zIndex: 9,
        position: 'absolute',
        color: (theme) => varAlpha(theme.vars.palette.common.whiteChannel, 0.8),
        bgcolor: (theme) => varAlpha(theme.vars.palette.grey['900Channel'], 0.72),
        '&:hover': { bgcolor: (theme) => varAlpha(theme.vars.palette.grey['900Channel'], 0.48) },
        ...sx,
      }}
      {...other}
    >
      <Iconify icon="mingcute:close-line" width={18} />
    </IconButton>
  );
}
