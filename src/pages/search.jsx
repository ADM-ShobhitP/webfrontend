import React from "react";
import { SearchProvider, SearchBox, Results, Facet, ResultsPerPage, Sorting, Paging, PagingInfo } from "@elastic/react-search-ui";
import { Typography, Card, CardMedia, CardContent, CardActions, Grid2, Button, } from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";
// import { Layout as ElasticLayout } from "@elastic/react-search-ui-views";
import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import dynamic from 'next/dynamic';

const ElasticLayout = dynamic(() => import('@elastic/react-search-ui-views'), {
  ssr: false,
});


const connector = new ElasticsearchAPIConnector({
  host: "https://localhost:9200",
  index: "geoapp_v3",
  apiKey: "ZllDTkJKWUJqUzhQY2x5MGxyM2I6b3lIY0k1dVdSY3FkdDljZm9OSWRfZw==",
});

const now = new Date();
const last90Days = new Date();
last90Days.setDate(now.getDate()-90);
const last90DaysISO = last90Days.toISOString();

const config = {
  searchQuery: {
    search_fields: {
      "details.name_client": {},
      "approvers.username": {},
      "collectors.username": {},
      "plant.name": {},
    },
    result_fields: {
      "details.name_client": { snippet: {} },
      "approvers.username": { snippet: {} },
      "collectors.username": { snippet: {} },
      "plant.name": { snippet: {} },
      visit_date: { raw: {} }
    },
    disjunctiveFacets: [
      "approvers.username.keyword",
      "collectors.username.keyword",
      "plant.name.keyword",
      "details.name_client.keyword"
    ],
    facets: {
      "approvers.username.keyword": {
        type: "value"
      },
      "collectors.username.keyword": {
        type: "value"
      },
      "plant.name.keyword": {
        type: "value"
      },
      "details.name_client.keyword": {
        type: "value"
      },
      visit_date: {
        type: "range",
        ranges: [
          {
            from: "2010-01-01T00:00:00Z",
            name: "Within the last 10 years"
          },
          {
            from: last90DaysISO,
            name: "Within the last 90 days"
          },
          {
            from: "2025-01-01T00:00:00Z",
            to: "2025-12-01T00:00:00Z",
            name: "1 - 12 months ago"
          },
          {
            to: "2000-01-01T00:00:00Z",
            name: "More than 25 years ago"
          }
        ]
      }
    }
  },
  autocompleteQuery: {
    suggestions: {
      types: {
        results: {
          fields: [
            "details.name_client.suggest",
          ]
        }
      },
      size: 2
    }
  },
  results: {
    resultsPerPage: 5,
    search_fields: {
      "details.name_client.suggest": { weight: 3 },
    },
    result_fields: {
      "details.name_client": { snippet: { size: 100, fallback: true } },
    }
  },
  apiConnector: connector,
  alwaysSearchOnInitialLoad: true
};



export default function Search() {
  const router = useRouter();

  const CustomResultView = ({ result }) => {
    console.log("Result Object:", result);
  
    const highlightText = (field, fallback) => {
      if (result[field]?.snippet) {
        return (
          <span
            style={{ color: 'blue', fontWeight: 'bold' }}
            dangerouslySetInnerHTML={{ __html: result[field].snippet.join(" ") }}
          />
        );
      }
      return result[field]?.raw || fallback;
    };
  
    return (
      <Grid2 >
        <Card variant="outlined"
          sx={{
            backgroundColor: 'white', borderRadius: 2, padding: 2, margin: 1,
            boxShadow: 3, fontFamily: 'monospace', width: { xs: '90vw', sm: '20vw' }, transition: 'transform 0.2s ease-in-out',
            '&:hover': { transform: 'scale(1.02)', boxShadow: 6 }
          }}
        >
          <CardMedia component="img" image="/meeting.png" alt="Approver" sx={{ borderRadius: 1 }} />
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>Visit Date:{" "}
              <Typography component="span" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>{result.visit_date?.raw || 'N/A'}</Typography>
            </Typography>
    
            <Typography variant="body1" sx={{ mb: 1, }}>
              <strong>Client Name:</strong>{" "}
              {Array.isArray(result.details?.raw)
                ? result.details.raw
                .map((detail) => highlightText('details.name_client.snippet', detail.name_client)).join(', ') : 'N/A'}
            </Typography>
    
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Approvers:</strong>{" "}
              {highlightText('approvers.username', result.approvers?.raw?.username || 'N/A' )}
            </Typography>
    
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Collectors:</strong>{" "}
              {Array.isArray(result.collectors?.raw)
                ? result.collectors.raw
                .map((collector) => highlightText('collectors.username.snippet', collector.username)).join(', ') : 'N/A'}
            </Typography>
    
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Plant Name:</strong>{" "}
              {highlightText('plant.name', result.plant?.raw?.name || 'N/A')}
            </Typography>
  
            <Typography variant="body1">
              <strong>Id:</strong>{" "}
              {highlightText('id', result.id?.raw || 'N/A')}
            </Typography>
          </CardContent>
          <CardActions>
            <Button  size="small" sx={{ color: 'blue' }} onClick={() => router.push(`/adetails?schedule_data=${result.id.raw}`)}>Learn More</Button>
          </CardActions>
        </Card>
      </Grid2>
    );   
  };  


  return (
    <Layout >
      <SearchProvider config={config}>
        <div className="App">
          <ErrorBoundary>
            <ElasticLayout
              header={
                <SearchBox
                  autocompleteMinimumCharacters={2}
                  autocompleteSuggestions={true}
                  debounceLength={300}
                />
              }
              sideContent={
                <div className="filter-section">
                  <Sorting label="Sort By" 
                    sortOptions={[
                      {
                        name: "Select Sort",
                        value: "",
                        direction: "",
                      },
                      {
                        name: "Visit Date (Newest Date)",
                        value: "visit_date",
                        direction: "desc"
                      },
                      {
                        name: "Visit Date (Oldest Date)",
                        value: "visit_date",
                        direction: "asc"
                      },
                    ]} />
                  <Facet key={"1"} field={"approvers.username.keyword"} label={"Approvers"} />
                  <Facet key={"2"} field={"collectors.username.keyword"} label={"Collectors"} />
                  <Facet key={"3"} field={"plant.name.keyword"} label={"Plant Name"} />
                  <Facet key={"4"} field={"details.name_client.keyword"} label={"Client Name"} />
                  <Facet key={"5"} field={"visit_date"} label={"Visit Date"} />
                </div>
              }
              bodyContent={<Results shouldTrackClickThrough={true} view={(props) => <Grid2 container spacing={1} direction="row" {...props} />} resultView={CustomResultView} />}

              bodyHeader={
                <React.Fragment>
                  <ResultsPerPage options={[10, 25, 50]} />
                </React.Fragment>
              }
              bodyFooter={<Paging />}
            />
          </ErrorBoundary>
        </div>
      </SearchProvider>
    </Layout>
  );
}