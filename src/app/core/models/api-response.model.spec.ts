import { getCollectionData } from './api-response.model';

interface Item {
  id: string;
}

describe('getCollectionData', () => {
  it('returns the response when it is already an array', () => {
    const data: Item[] = [{ id: '1' }];

    expect(getCollectionData<Item>(data)).toEqual(data);
  });

  it('returns a nested data collection', () => {
    const response = { data: { data: [{ id: '1' }] } };

    expect(getCollectionData<Item>(response)).toEqual([{ id: '1' }]);
  });

  it('returns a named collection', () => {
    const response = { products: [{ id: 'p1' }] };

    expect(getCollectionData<Item>(response, 'products')).toEqual([{ id: 'p1' }]);
  });

  it('returns an empty array when no collection is available', () => {
    expect(getCollectionData<Item>({ message: 'ok' })).toEqual([]);
  });
});
