import { getPaginationItems, range } from './pagination';

const base = { siblingCount: 1, boundaryCount: 1, showFirstButton: false, showLastButton: false, hidePrevButton: false, hideNextButton: false };

describe('getPaginationItems (algoritmo usePagination de MUI)', () => {
  it('sin elipsis para pocas páginas', () => {
    expect(getPaginationItems({ ...base, count: 5, page: 1 })).toEqual(['previous', 1, 2, 3, 4, 5, 'next']);
  });

  it('elipsis final, ambas e inicial', () => {
    expect(getPaginationItems({ ...base, count: 10, page: 1 })).toEqual(['previous', 1, 2, 3, 4, 5, 'end-ellipsis', 10, 'next']);
    expect(getPaginationItems({ ...base, count: 10, page: 5 })).toEqual(['previous', 1, 'start-ellipsis', 4, 5, 6, 'end-ellipsis', 10, 'next']);
    expect(getPaginationItems({ ...base, count: 10, page: 10 })).toEqual(['previous', 1, 'start-ellipsis', 6, 7, 8, 9, 10, 'next']);
  });

  it('sibling/boundary y botones primera/última', () => {
    expect(getPaginationItems({ ...base, count: 11, page: 6, siblingCount: 0, showFirstButton: true, showLastButton: true }))
      .toEqual(['first', 'previous', 1, 'start-ellipsis', 6, 'end-ellipsis', 11, 'next', 'last']);
    expect(getPaginationItems({ ...base, count: 11, page: 6, boundaryCount: 2, hidePrevButton: true, hideNextButton: true }))
      .toEqual([1, 2, 'start-ellipsis', 5, 6, 7, 'end-ellipsis', 10, 11]);
  });

  it('usa siblingCount=1 y boundaryCount=1 por defecto', () => {
    expect(getPaginationItems({ count: 10, page: 5 })).toEqual(getPaginationItems({ ...base, count: 10, page: 5 }));
  });

  it('casos límite: una página, cero páginas y boundaryCount 0', () => {
    expect(getPaginationItems({ count: 1, page: 1 })).toEqual(['previous', 1, 'next']);
    expect(getPaginationItems({ count: 0, page: 1, hidePrevButton: true, hideNextButton: true })).toEqual([]);
    expect(getPaginationItems({ count: 10, page: 5, boundaryCount: 0, hidePrevButton: true, hideNextButton: true }))
      .toEqual(['start-ellipsis', 4, 5, 6, 'end-ellipsis']);
  });

  it('range inclusivo', () => {
    expect(range(2, 4)).toEqual([2, 3, 4]);
    expect(range(3, 2)).toEqual([]);
  });
});
