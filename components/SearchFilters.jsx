import { useEffect, useState } from 'react';
import { Flex, Select, Box, Text, Input, Spinner, Icon, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { MdCancel } from 'react-icons/md';
import Image from 'next/image';

import { filterData, getFilterValues } from '../utils/filterData';
import { baseUrl, fetchApi } from '../utils/fetchApi';
import noresult from '../assets/images/noresult.svg';


const SearchFilters = () => {
    const [filters,setFilters]=useState(filterData);
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [locationData, setLocationData] = useState(null);
    const [showLocations, setShowLocations] = useState(false);
    const [loading, setLoading] = useState(false);


    // filterValues is an object
    const searchProperties =(filterValues) =>{
        // console.log(filterValues);
// path is /search
const path=router.pathname;
// query is queryParameter ?purpose=for-rent
// query is an object
const { query }=router;
// console.log(query);
// getFilterValues is function define in utils which accept
// values in his parameter .. check function ..very easy
const values=getFilterValues(filterValues);
// console.log(values);

// values is array return by getFilterValues function
values.forEach( (item) =>{
// console.log(item);

// if we dont check item.value all objects with undefined
// values are added to query 

if(item.value && filterValues?.[item.name]){

query[item.name]=item.value;
// console.log(query);
}    
})

router.push({pathname:path,query:query})
    }

    // search location  
    useEffect( () =>{
        if(searchTerm !== ""){
            const fetchData =async() =>{
                setLoading(true);
                const data = await fetchApi(`${baseUrl}/auto-complete?query=${searchTerm}`);
                setLoading(false);
                setLocationData(data?.hits)
            }
            fetchData();
        }
    },[searchTerm])

    return (
        <Flex bg='gray.100' p='4' justifyContent='center' flexWrap='wrap'>
            {filters.map( (filter) =>(
                <Box key={filter.queryName}>
                    <Select 
                    w="fit-content"
                    onChange={(e) =>searchProperties({[filter.queryName]:e.target.value }) }
                    p="2"
                    placeholder={filter.placeholder}> 
                    {filter?.items?.map( (item) =>(
                        <option value={item.value} key={item.value}>
                            {item.name}
                        </option>
                    ))}
                    </Select>
                </Box>
            ))}
          {/* search location -------------   */}
          <Flex flexDirection="column">
         
          <Button onClick={() => setShowLocations(!showLocations)} border='1px' borderColor='gray.200' marginTop='2' >
          Search Location
        </Button>

        {showLocations && (
            <Flex flexDirection="column" pos="relative" paddingTop='2' >
                   <Input
              placeholder='Type Here'
              value={searchTerm}
              w='300px'
              focusBorderColor='gray.300'
              onChange={(e) => setSearchTerm(e.target.value)}
              
            />
              {searchTerm !== '' && (
              <Icon
                as={MdCancel}
                pos='absolute'
                cursor='pointer'
                right='5'
                top='5'
                zIndex='100'
                onClick={() => setSearchTerm('')}
              />
            )}
             {loading && <Spinner margin='auto' marginTop='3' />}

             {showLocations && (
                 <Box height='300px' overflow='auto'  >
                     {locationData?.map( (location) =>(
                         <Box
                         key={location.id}
                         onClick={() => {
                           searchProperties({ locationExternalIDs: location.externalID });
                           setShowLocations(false);
                           setSearchTerm(location.name);
                         }}
                         >
                                <Text cursor='pointer' bg='gray.200' p='2' borderBottom='1px' borderColor='gray.100' >
                      {location.name}
                    </Text>

                         </Box>
                     ))}
                      {!loading && !locationData?.length && (
                  <Flex justifyContent='center' alignItems='center' flexDir='column' marginTop='5' marginBottom='5' >
                    <Image src={noresult} />
                    <Text fontSize='xl' marginTop='3'>
                      Waiting to search!
                    </Text>
                  </Flex>
                )}
                 </Box>
             )}
            </Flex>
        )}


          </Flex>
        </Flex>
    )
}

export default SearchFilters
