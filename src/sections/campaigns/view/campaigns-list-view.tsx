import type { ICampaignItem } from 'src/types/campaign';
import type { GridColDef, GridColumnVisibilityModel } from '@mui/x-data-grid';

import { useState, useEffect, useContext, useCallback } from 'react';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { Alert, AlertTitle } from '@mui/material';
import { DataGrid, gridClasses, GridActionsCellItem } from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { AuthContext } from 'src/auth/context/auth-context';

import { getCampaigns } from '../context/action';
import { GetCampaignsContext } from '../context/get-campaigns-provider';
import {
  RenderCellPublish,
  RenderCellCampaign,
  RenderCellStartDate,
  RenderCellCreatedDate,
} from '../campaign-table-row';

// ----------------------------------------------------------------------

const PUBLISH_OPTIONS = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
];

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

export function CampaignsListView() {
  const authContext = useContext(AuthContext);
  const businessId = authContext?.user?.business_account.id;

  const getCampaignsContext = useContext(GetCampaignsContext);

  const [campaignsLoading, setCampaignsLoading] = useState<boolean>(false);
  const [tableData, setTableData] = useState<ICampaignItem[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const getCampaignsData = async () => {
      setCampaignsLoading(true);
      try {
        const campaigns = await getCampaigns(businessId);
        setTableData(campaigns);
        getCampaignsContext?.onSetCampaigns(campaigns || []);
        setCampaignsLoading(false);
      } catch (error) {
        setErrorMessage(typeof error === 'string' ? error : error.message);
      }
      setCampaignsLoading(false);
    };
    getCampaignsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  const router = useRouter();

  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.campaigns.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.campaigns.details(id));
    },
    [router]
  );

  const columns: GridColDef[] = [
    {
      field: 'title',
      headerName: 'Name',
      flex: 1,
      minWidth: 360,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <RenderCellCampaign params={params} onViewRow={() => handleViewRow(params.row.id)} />
      ),
    },
    {
      field: 'created_at',
      headerName: 'Created at',
      width: 150,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellCreatedDate params={params} />,
    },
    {
      field: 'start_date',
      headerName: 'Start Date',
      width: 150,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellStartDate params={params} />,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 110,
      type: 'singleSelect',
      valueOptions: PUBLISH_OPTIONS,
      disableColumnMenu: true,
      renderCell: (params) => <RenderCellPublish params={params} />,
    },
    {
      type: 'actions',
      field: 'actions',
      headerName: ' ',
      align: 'right',
      headerAlign: 'right',
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      getActions: (params) => [
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:eye-bold" />}
          label="View"
          onClick={() => handleViewRow(params.row.id)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Edit"
          onClick={() => handleEditRow(params.row.id)}
        />,
      ],
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading="List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Campaigns', href: paths.dashboard.campaigns.root },
          { name: 'List' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.campaigns.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Campaign
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMessage('')}>
          <AlertTitle sx={{ textTransform: 'capitalize' }}> Error</AlertTitle>
          {errorMessage}
        </Alert>
      )}
      <Card
        sx={{
          flexGrow: { md: 1 },
          display: { md: 'flex' },
          height: { xs: 800, md: 2 },
          flexDirection: { md: 'column' },
        }}
      >
        <DataGrid
          disableRowSelectionOnClick
          rows={tableData}
          columns={columns}
          loading={campaignsLoading}
          getRowHeight={() => 'auto'}
          pageSizeOptions={[5, 10, 25]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
          slots={{
            noRowsOverlay: () => <EmptyContent title="No campaigns found for this account." />,
            noResultsOverlay: () => <EmptyContent title="No campaigns found for this account." />,
          }}
          slotProps={{
            panel: { anchorEl: filterButtonEl },
            toolbar: { setFilterButtonEl },
            columnsManagement: { getTogglableColumns },
          }}
          sx={{ [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' } }}
        />
      </Card>
    </DashboardContent>
  );
}
