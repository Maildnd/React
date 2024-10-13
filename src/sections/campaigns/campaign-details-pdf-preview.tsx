import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

import { useState } from 'react';
import { Page, pdfjs, Document } from 'react-pdf';

import { Box } from '@mui/material';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const PDFPreview = ({ file }: { file: File }) => {
  const [pageCount, setPageCount] = useState<number>(0);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log('numPages: ', numPages);
    setPageCount(numPages);
  };

  return (
    <Box sx={{ border: 0.5, borderRadius: 1, borderColor: 'lightgray' }}>
      <Box
        sx={{
          p: 1,
          mb: 2.5,
          position: 'relative',
          maxHeight: '700px',
          borderRadius: 1,
          overflow: 'auto',
        }}
      >
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from(new Array(pageCount), (el, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
          ))}
        </Document>
      </Box>
    </Box>
  );
};
