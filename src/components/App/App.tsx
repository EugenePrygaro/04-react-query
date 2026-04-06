import { useState } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import { useQuery } from '@tanstack/react-query';

import Pagination from './Pagination';
import fetchMovies from '../../services/movieService';
import { type Movie } from '../../types/movie';
import { Toaster } from 'react-hot-toast';

function App() {
  // const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSubmitSearchBar = async (query: string) => {
    setQuery(query);
    setCurrentPage(1);
  };

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['movies', query, currentPage],
    queryFn: () => fetchMovies(query, currentPage),
    enabled: !!query,
  });

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsOpenModal(true);
  };

  const isDataEmpty = data?.results.length === 0;
  return (
    <>
      <div>
        <Toaster />
      </div>
      <SearchBar onSubmit={handleSubmitSearchBar}></SearchBar>
      {isSuccess && data.total_pages > 1 && (
        <Pagination
          totalPages={data.total_pages}
          page={currentPage}
          setPage={setCurrentPage}
        />
      )}
      {isLoading && <Loader></Loader>}
      {isError && <ErrorMessage />}
      {!isDataEmpty && isSuccess && (
        <MovieGrid
          onSelect={handleSelectMovie}
          movies={data?.results as Movie[]}
        ></MovieGrid>
      )}
      {isOpenModal && selectedMovie && (
        <MovieModal
          onClose={() => {
            setIsOpenModal(false);
            setSelectedMovie(null);
          }}
          movie={selectedMovie}
        ></MovieModal>
      )}
    </>
  );
}

export default App;
