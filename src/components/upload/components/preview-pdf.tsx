import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

import { useState } from 'react';
import { Page, pdfjs, Document } from 'react-pdf';

import { Box, Stack, Button } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { uploadClasses } from '../classes';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const PDFPreview = ({ file }: { file: File }) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState<number>(8);

  function onDocumentLoadSuccess(): void {
    setNumPages(8);
    setPageNumber(1);
  }
  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  const previousPage = () => {
    changePage(-1);
  };

  const nextPage = () => {
    changePage(1);
  };

  return (
    <>
      <Box
        className={uploadClasses.uploadSinglePreview.concat('')}
        sx={{
          p: 1,
          top: 0,
          left: 0,
          width: 1,
          height: 1,
          position: 'absolute',
        }}
      >
        <Box sx={{ mb: 2.5, position: 'relative', maxHeight: '700px', overflow: 'auto' }}>
          <Document file={file} onLoadSuccess={() => onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} />
          </Document>
        </Box>
      </Box>

      <Stack direction="row" sx={{ mb: { xs: 3, md: 5 }, mt: 3 }} justifyContent="center">
        <Button
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          onClick={previousPage}
          disabled={pageNumber <= 1}
        />
        <Button
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={16} />}
          onClick={nextPage}
          disabled={pageNumber >= numPages!}
        />
      </Stack>
    </>
  );
};
