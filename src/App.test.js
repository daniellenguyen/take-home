import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';

import { enableFetchMocks } from 'jest-fetch-mock';

import App from './App';

enableFetchMocks();

describe('App', () => {
  beforeEach(() => {
    fetch.resetMocks();
    // fetch.doMock();
    fetch.mockIf(/^https:\/\/api\.discogs\.com\/users\/blacklight\/collection\/folders\/0\/releases\?.*$/, async (req) => {
      // debugger
      if (req.url.endsWith("page=1&per_page=5")) {
        return JSON.stringify({
          pagination: {
            items: 2,
            page: 1,
            pages: 2,
            per_page: 1
          },
          releases: [
            {
              id: 76035,
              basic_information: {
                master_id: 64128,
                title: 'Dirty Dancing',
                year: 2002,
                formats: [{ name: 'Vinyl' }],
                labels: [{ name: '!K7 Records' }],
                artists: [{ name: 'Swayzak' }],
              },
            },
          ],
        })
      } else if (req.url.endsWith("page=2&per_page=5")) {
        return JSON.stringify({
          pagination: {
            items: 2,
            page: 2,
            pages: 2,
            per_page: 1
          },
          releases: [
            {
              id: 198657,
              basic_information: {
                master_id: 1,
                title: 'Sound Of Music',
                year: 2002,
                formats: [{ name: 'CD' }],
                labels: [{ name: "[OHM] Records" }],
                artists: ["Jazkamer"],
              },
            },
          ],
        })
      
      } else {
        return JSON.stringify({
          status: 404,
          body: "Not Found"
        })
      }
    }) 
  })

  it('can add a shelf', async () => {
    const { asFragment } = render(<App />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByText('Add Shelf'));
    fireEvent.change(screen.getByTestId('add-shelf'), {
      target: { value: 'first shelf' },
    });
    fireEvent.click(screen.getByText('Submit'));

    expect(asFragment()).toMatchSnapshot();
  });

  it('can remove a shelf', async () => {
    const { asFragment } = render(<App />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByText('Add Shelf'));
    fireEvent.change(screen.getByTestId('add-shelf'), {
      target: { value: 'first shelf' },
    });
    fireEvent.click(screen.getByText('Submit'));

    fireEvent.click(screen.getByText('Remove'));
    expect(asFragment()).toMatchSnapshot();
  });

  //describe pagination
  it('can paginate record list', async () => {
    const { asFragment } = render(<App />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    const recordsBeforePagination = screen.getAllByTestId('record')

    // fetch.once(
    //   JSON.stringify({
    //     releases: [
    //       {
    //         id: 198657,
    //         basic_information: {
    //           master_id: 1,
    //           title: 'Sound Of Music',
    //           year: 2002,
    //           formats: [{ name: 'CD' }],
    //           labels: [{ name: "[OHM] Records" }],
    //           artists: ["Jazkamer"],
    //         },
    //       },
    //     ],
    //   }),
    // );

    fireEvent.click(screen.getByText('More'));
    const recordsAfterPagination = screen.getAllByTestId('record').length
    await waitFor(() => expect(recordsAfterPagination === recordsBeforePagination + 1))

  })

  it('does not skip records while paginating', async () => {
    const { asFragment } = render(<App />);
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    fireEvent.click(screen.getByText('More'));
    const records = screen.getAllByTestId('record').length
    await waitFor(() => expect(screen.getAllByTestId('record').length === 2))
    // mock a response that with this url, returns this response
    // moch another response that with this url, returns this response
    // call both mocks
    // assert that there are two of the correct records in the list
  })

  it('removes pagination button at the end of the list', async () => {
    // mock that response of last page is returned
    // assert that i can't find the more button anymore
  })
});