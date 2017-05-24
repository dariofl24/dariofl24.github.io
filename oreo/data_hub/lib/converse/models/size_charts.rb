module Converse
    module SizeCharts

        STANDARD = {
            :name => "standard",
            :sizes => {
                "025" => { Men: "2.5",  Women: "4"    },
                "030" => { Men: "3",    Women: "4.5"  },
                "035" => { Men: "3.5",  Women: "5"    },
                "040" => { Men: "4",    Women: "5.5"  },
                "045" => { Men: "4.5",  Women: "6"    },
                "050" => { Men: "5",    Women: "6.5"  },
                "055" => { Men: "5.5",  Women: "7"    },
                "060" => { Men: "6",    Women: "7.5"  },
                "065" => { Men: "6.5",  Women: "8"    },
                "070" => { Men: "7",    Women: "8.5"  },
                "075" => { Men: "7.5",  Women: "9"    },
                "080" => { Men: "8",    Women: "9.5"  },
                "085" => { Men: "8.5",  Women: "10"   },
                "090" => { Men: "9",    Women: "10.5" },
                "095" => { Men: "9.5",  Women: "11"   },
                "100" => { Men: "10",   Women: "11.5" },
                "105" => { Men: "10.5", Women: "12"   },
                "110" => { Men: "11",   Women: "12.5" },
                "115" => { Men: "11.5", Women: "13"   },
                "120" => { Men: "12",   Women: "13.5" },
                "125" => { Men: "12.5", Women: "14"   },
                "130" => { Men: "13",   Women: "14.5" },
                "135" => { Men: "13.5", Women: "15"   },
                "140" => { Men: "14",   Women: "15.5" },
                "145" => { Men: "14.5", Women: "16"   },
                "150" => { Men: "15",   Women: "16.5" },
                "155" => { Men: "15.5", Women: "17"   },
                "160" => { Men: "16",   Women: "17.5" },
                "165" => { Men: "16.5", Women: "18"   },
                "170" => { Men: "17",   Women: "18.5" },
                "175" => { Men: "17.5", Women: "19"   },
                "180" => { Men: "18",   Women: "19.5" },
                "185" => { Men: "18.5", Women: "20"   },
                "190" => { Men: "19",   Women: "20.5" },
                "195" => { Men: "19.5", Women: "21"   },
                "200" => { Men: "20",   Women: "21.5" }
            }
        }

        CHUCK = {
            :name => "chuck",
            :sizes => {
                "020" => { Men: "2",    Women: "4"    },
                "025" => { Men: "2.5",  Women: "4.5"  },
                "030" => { Men: "3",    Women: "5"    },
                "035" => { Men: "3.5",  Women: "5.5"  },
                "040" => { Men: "4",    Women: "6"    },
                "045" => { Men: "4.5",  Women: "6.5"  },
                "050" => { Men: "5",    Women: "7"    },
                "055" => { Men: "5.5",  Women: "7.5"  },
                "060" => { Men: "6",    Women: "8"    },
                "065" => { Men: "6.5",  Women: "8.5"  },
                "070" => { Men: "7",    Women: "9"    },
                "075" => { Men: "7.5",  Women: "9.5"  },
                "080" => { Men: "8",    Women: "10"   },
                "085" => { Men: "8.5",  Women: "10.5" },
                "090" => { Men: "9",    Women: "11"   },
                "095" => { Men: "9.5",  Women: "11.5" },
                "100" => { Men: "10",   Women: "12"   },
                "105" => { Men: "10.5", Women: "12.5" },
                "110" => { Men: "11",   Women: "13"   },
                "115" => { Men: "11.5", Women: "13.5" },
                "120" => { Men: "12",   Women: "14"   },
                "125" => { Men: "12.5", Women: "14.5" },
                "130" => { Men: "13",   Women: "15"   },
                "135" => { Men: "13.5", Women: "15.5" },
                "140" => { Men: "14",   Women: "16"   },
                "145" => { Men: "14.5", Women: "16.5" },
                "150" => { Men: "15",   Women: "17"   },
                "155" => { Men: "15.5", Women: "17.5" },
                "160" => { Men: "16",   Women: "18"   },
                "165" => { Men: "16.5", Women: "18.5" },
                "170" => { Men: "17",   Women: "19"   },
                "175" => { Men: "17.5", Women: "19.5" },
                "180" => { Men: "18",   Women: "20"   },
                "185" => { Men: "18.5", Women: "20.5" },
                "190" => { Men: "19",   Women: "21"   },
                "195" => { Men: "19.5", Women: "21.5" },
                "200" => { Men: "20",   Women: "22"   }
            }
        }

        JACK = {
            :name => "jack",
            :sizes => {
                "025" => { Men: "2.5",  Women: "4"    },
                "030" => { Men: "3",    Women: "4.5"  },
                "035" => { Men: "3.5",  Women: "5"    },
                "040" => { Men: "4",    Women: "5.5"  },
                "045" => { Men: "4.5",  Women: "6"    },
                "050" => { Men: "5",    Women: "6.5"  },
                "055" => { Men: "5.5",  Women: "7"    },
                "060" => { Men: "6",    Women: "7.5"  },
                "065" => { Men: "6.5",  Women: "8"    },
                "070" => { Men: "7",    Women: "8.5"  },
                "075" => { Men: "7.5",  Women: "9"    },
                "080" => { Men: "8",    Women: "9.5"  },
                "085" => { Men: "8.5",  Women: "10"   },
                "090" => { Men: "9",    Women: "10.5" },
                "095" => { Men: "9.5",  Women: "11"   },
                "100" => { Men: "10",   Women: "11.5" },
                "105" => { Men: "10.5", Women: "12"   },
                "110" => { Men: "11",   Women: "12.5" },
                "115" => { Men: "11.5", Women: "13"   },
                "120" => { Men: "12",   Women: "13.5" },
                "125" => { Men: "12.5", Women: "14"   },
                "130" => { Men: "13",   Women: "14.5" },
                "135" => { Men: "13.5", Women: "15"   },
                "140" => { Men: "14",   Women: "15.5" },
                "145" => { Men: "14.5", Women: "16"   },
                "150" => { Men: "15",   Women: "16.5" },
                "155" => { Men: "15.5", Women: "17"   },
                "160" => { Men: "16",   Women: "17.5" },
                "165" => { Men: "16.5", Women: "18"   },
                "170" => { Men: "17",   Women: "18.5" },
                "175" => { Men: "17.5", Women: "19"   },
                "180" => { Men: "18",   Women: "19.5" },
                "185" => { Men: "18.5", Women: "20"   },
                "190" => { Men: "19",   Women: "20.5" },
                "195" => { Men: "19.5", Women: "21"   },
                "200" => { Men: "20",   Women: "21.5" }
            }
        }

        WOMENS = {
            :name => "womens",
            :sizes => {
                "020" => { Women: "2"    },
                "025" => { Women: "2.5"  },
                "030" => { Women: "3"    },
                "035" => { Women: "3.5"  },
                "040" => { Women: "4"    },
                "045" => { Women: "4.5"  },
                "050" => { Women: "5"    },
                "055" => { Women: "5.5"  },
                "060" => { Women: "6"    },
                "065" => { Women: "6.5"  },
                "070" => { Women: "7"    },
                "075" => { Women: "7.5"  },
                "080" => { Women: "8"    },
                "085" => { Women: "8.5"  },
                "090" => { Women: "9"    },
                "095" => { Women: "9.5"  },
                "100" => { Women: "10"   },
                "105" => { Women: "10.5" },
                "110" => { Women: "11"   },
                "115" => { Women: "11.5" },
                "120" => { Women: "12"   },
                "125" => { Women: "12.5" },
                "130" => { Women: "13"   },
                "135" => { Women: "13.5" },
                "140" => { Women: "14"   },
                "145" => { Women: "14.5" },
                "150" => { Women: "15"   },
                "155" => { Women: "15.5" },
                "160" => { Women: "16"   },
                "165" => { Women: "16.5" },
                "170" => { Women: "17"   },
                "175" => { Women: "17.5" },
                "180" => { Women: "18"   },
                "185" => { Women: "18.5" },
                "190" => { Women: "19"   },
                "195" => { Women: "19.5" },
                "200" => { Women: "20"   }
            }
        }

        MENS = {
            :name => "mens",
            :sizes => {}
        }

        UNISEX = {
            :name => "unisex",
            :sizes => {}
        }

        KIDS_NEWBORN = {
            :name => "kids-newborn",
            :sizes => {
                "010" => { PDP: "1 (0 - 1 yr)", Other: "Infant 1" },
                "015" => { PDP: "1.5 (0 - 1 yr)", Other: "Infant 1.5" },
                "020" => { PDP: "2 (0 - 1 yr)", Other: "Infant 2" },
                "025" => { PDP: "2.5 (0 - 1 yr)", Other: "Infant 2.5" },
                "030" => { PDP: "3 (0 - 1 yr)", Other: "Infant 3" },
                "035" => { PDP: "3.5 (0 - 1 yr)", Other: "Infant 3.5" },
                "040" => { PDP: "4 (0 - 1 yr)", Other: "Infant 4" },
                "045" => { PDP: "4.5 (0 - 1 yr)", Other: "Infant 4.5" },
                "050" => { PDP: "5 (0 - 1 yr)", Other: "Infant 5" },
                "055" => { PDP: "5.5 (0 - 1 yr)", Other: "Infant 5.5" },
                "060" => { PDP: "6 (0 - 1 yr)", Other: "Infant 6" },
                "065" => { PDP: "6.5 (0 - 1 yr)", Other: "Infant 6.5" },
                "070" => { PDP: "7 (0 - 1 yr)", Other: "Infant 7" },
                "075" => { PDP: "7.5 (0 - 1 yr)", Other: "Infant 7.5" },
                "080" => { PDP: "8 (0 - 1 yr)", Other: "Infant 8" },
                "085" => { PDP: "8.5 (0 - 1 yr)", Other: "Infant 8.5" },
                "090" => { PDP: "9 (0 - 1 yr)", Other: "Infant 9" },
                "095" => { PDP: "9.5 (0 - 1 yr)", Other: "Infant 9.5" },
                "100" => { PDP: "10 (0 - 1 yr)", Other: "Infant 10" },
                "105" => { PDP: "10.5 (0 - 1 yr)", Other: "Infant 10.5" },
                "110" => { PDP: "11 (0 - 1 yr)", Other: "Infant 11" },
                "115" => { PDP: "11.5 (0 - 1 yr)", Other: "Infant 11.5" },
                "120" => { PDP: "12 (0 - 1 yr)", Other: "Infant 12" },
                "125" => { PDP: "12.5 (0 - 1 yr)", Other: "Infant 12.5" },
                "130" => { PDP: "13 (0 - 1 yr)", Other: "Infant 13" },
                "135" => { PDP: "13.5 (0 - 1 yr)", Other: "Infant 13.5" },
                "140" => { PDP: "14 (0 - 1 yr)", Other: "Infant 14" },
                "145" => { PDP: "14.5 (0 - 1 yr)", Other: "Infant 14.5" },
                "150" => { PDP: "15 (0 - 1 yr)", Other: "Infant 15" },
                "155" => { PDP: "15.5 (0 - 1 yr)", Other: "Infant 15.5" },
                "160" => { PDP: "16 (0 - 1 yr)", Other: "Infant 16" },
                "165" => { PDP: "16.5 (0 - 1 yr)", Other: "Infant 16.5" },
                "170" => { PDP: "17 (0 - 1 yr)", Other: "Infant 17" },
                "175" => { PDP: "17.5 (0 - 1 yr)", Other: "Infant 17.5" },
                "180" => { PDP: "18 (0 - 1 yr)", Other: "Infant 18" },
                "185" => { PDP: "18.5 (0 - 1 yr)", Other: "Infant 18.5" },
                "190" => { PDP: "19 (0 - 1 yr)", Other: "Infant 19" },
                "195" => { PDP: "19.5 (0 - 1 yr)", Other: "Infant 19.5" },
                "200" => { PDP: "20 (0 - 1 yr)", Other: "Infant 20" },
                "XS" => { PDP: "XS (0 - 1 yr)", Other: "Infant XS" },
                "S" => { PDP: "S (0 - 1 yr)", Other: "Infant S" },
                "SM" => { PDP: "SM (0 - 1 yr)", Other: "Infant SM" },
                "M" => { PDP: "M (0 - 1 yr)", Other: "Infant M" },
                "L" => { PDP: "L (0 - 1 yr)", Other: "Infant L" },
                "XL" => { PDP: "XL (0 - 1 yr)", Other: "Infant XL" }
            }
        }

        KIDS_TODDLER = {
            :name => "kids-toddler",
            :sizes => {
                "010" => { PDP: "1 (1 - 3.5 yrs)", Other: "Toddler 1" },
                "015" => { PDP: "1.5 (1 - 3.5 yrs)", Other: "Toddler 1.5" },
                "020" => { PDP: "2 (1 - 3.5 yrs)", Other: "Toddler 2" },
                "025" => { PDP: "2.5 (1 - 3.5 yrs)", Other: "Toddler 2.5" },
                "030" => { PDP: "3 (1 - 3.5 yrs)", Other: "Toddler 3" },
                "035" => { PDP: "3.5 (1 - 3.5 yrs)", Other: "Toddler 3.5" },
                "040" => { PDP: "4 (1 - 3.5 yrs)", Other: "Toddler 4" },
                "045" => { PDP: "4.5 (1 - 3.5 yrs)", Other: "Toddler 4.5" },
                "050" => { PDP: "5 (1 - 3.5 yrs)", Other: "Toddler 5" },
                "055" => { PDP: "5.5 (1 - 3.5 yrs)", Other: "Toddler 5.5" },
                "060" => { PDP: "6 (1 - 3.5 yrs)", Other: "Toddler 6" },
                "065" => { PDP: "6.5 (1 - 3.5 yrs)", Other: "Toddler 6.5" },
                "070" => { PDP: "7 (1 - 3.5 yrs)", Other: "Toddler 7" },
                "075" => { PDP: "7.5 (1 - 3.5 yrs)", Other: "Toddler 7.5" },
                "080" => { PDP: "8 (1 - 3.5 yrs)", Other: "Toddler 8" },
                "085" => { PDP: "8.5 (1 - 3.5 yrs)", Other: "Toddler 8.5" },
                "090" => { PDP: "9 (1 - 3.5 yrs)", Other: "Toddler 9" },
                "095" => { PDP: "9.5 (1 - 3.5 yrs)", Other: "Toddler 9.5" },
                "100" => { PDP: "10 (1 - 3.5 yrs)", Other: "Toddler 10" },
                "105" => { PDP: "10.5 (1 - 3.5 yrs)", Other: "Toddler 10.5" },
                "110" => { PDP: "11 (1 - 3.5 yrs)", Other: "Toddler 11" },
                "115" => { PDP: "11.5 (1 - 3.5 yrs)", Other: "Toddler 11.5" },
                "120" => { PDP: "12 (1 - 3.5 yrs)", Other: "Toddler 12" },
                "125" => { PDP: "12.5 (1 - 3.5 yrs)", Other: "Toddler 12.5" },
                "130" => { PDP: "13 (1 - 3.5 yrs)", Other: "Toddler 13" },
                "135" => { PDP: "13.5 (1 - 3.5 yrs)", Other: "Toddler 13.5" },
                "140" => { PDP: "14 (1 - 3.5 yrs)", Other: "Toddler 14" },
                "145" => { PDP: "14.5 (1 - 3.5 yrs)", Other: "Toddler 14.5" },
                "150" => { PDP: "15 (1 - 3.5 yrs)", Other: "Toddler 15" },
                "155" => { PDP: "15.5 (1 - 3.5 yrs)", Other: "Toddler 15.5" },
                "160" => { PDP: "16 (1 - 3.5 yrs)", Other: "Toddler 16" },
                "165" => { PDP: "16.5 (1 - 3.5 yrs)", Other: "Toddler 16.5" },
                "170" => { PDP: "17 (1 - 3.5 yrs)", Other: "Toddler 17" },
                "175" => { PDP: "17.5 (1 - 3.5 yrs)", Other: "Toddler 17.5" },
                "180" => { PDP: "18 (1 - 3.5 yrs)", Other: "Toddler 18" },
                "185" => { PDP: "18.5 (1 - 3.5 yrs)", Other: "Toddler 18.5" },
                "190" => { PDP: "19 (1 - 3.5 yrs)", Other: "Toddler 19" },
                "195" => { PDP: "19.5 (1 - 3.5 yrs)", Other: "Toddler 19.5" },
                "200" => { PDP: "20 (1 - 3.5 yrs)", Other: "Toddler 20" },
                "XS" => { PDP: "XS (1 - 3.5 yrs)", Other: "Toddler XS" },
                "S" => { PDP: "S (1 - 3.5 yrs)", Other: "Toddler S" },
                "SM" => { PDP: "SM (1 - 3.5 yrs)", Other: "Toddler SM" },
                "M" => { PDP: "M (1 - 3.5 yrs)", Other: "Toddler M" },
                "L" => { PDP: "L (1 - 3.5 yrs)", Other: "Toddler L" },
                "XL" => { PDP: "XL (1 - 3.5 yrs)", Other: "Toddler XL" }
            }
        }

        KIDS_YOUTH = {
            :name => "kids-youth",
            :sizes => {
                "010" => { PDP: "1 (4 - 7 yrs)", Other: "Youth 1" },
                "015" => { PDP: "1.5 (4 - 7 yrs)", Other: "Youth 1.5" },
                "020" => { PDP: "2 (4 - 7 yrs)", Other: "Youth 2" },
                "025" => { PDP: "2.5 (4 - 7 yrs)", Other: "Youth 2.5" },
                "030" => { PDP: "3 (4 - 7 yrs)", Other: "Youth 3" },
                "035" => { PDP: "3.5 (4 - 7 yrs)", Other: "Youth 3.5" },
                "040" => { PDP: "4 (4 - 7 yrs)", Other: "Youth 4" },
                "045" => { PDP: "4.5 (4 - 7 yrs)", Other: "Youth 4.5" },
                "050" => { PDP: "5 (4 - 7 yrs)", Other: "Youth 5" },
                "055" => { PDP: "5.5 (4 - 7 yrs)", Other: "Youth 5.5" },
                "060" => { PDP: "6 (4 - 7 yrs)", Other: "Youth 6" },
                "065" => { PDP: "6.5 (4 - 7 yrs)", Other: "Youth 6.5" },
                "070" => { PDP: "7 (4 - 7 yrs)", Other: "Youth 7" },
                "075" => { PDP: "7.5 (4 - 7 yrs)", Other: "Youth 7.5" },
                "080" => { PDP: "8 (4 - 7 yrs)", Other: "Youth 8" },
                "085" => { PDP: "8.5 (4 - 7 yrs)", Other: "Youth 8.5" },
                "090" => { PDP: "9 (4 - 7 yrs)", Other: "Youth 9" },
                "095" => { PDP: "9.5 (4 - 7 yrs)", Other: "Youth 9.5" },
                "100" => { PDP: "10 (4 - 7 yrs)", Other: "Youth 10" },
                "105" => { PDP: "10.5 (4 - 7 yrs)", Other: "Youth 10.5" },
                "110" => { PDP: "11 (4 - 7 yrs)", Other: "Youth 11" },
                "115" => { PDP: "11.5 (4 - 7 yrs)", Other: "Youth 11.5" },
                "120" => { PDP: "12 (4 - 7 yrs)", Other: "Youth 12" },
                "125" => { PDP: "12.5 (4 - 7 yrs)", Other: "Youth 12.5" },
                "130" => { PDP: "13 (4 - 7 yrs)", Other: "Youth 13" },
                "135" => { PDP: "13.5 (4 - 7 yrs)", Other: "Youth 13.5" },
                "140" => { PDP: "14 (4 - 7 yrs)", Other: "Youth 14" },
                "145" => { PDP: "14.5 (4 - 7 yrs)", Other: "Youth 14.5" },
                "150" => { PDP: "15 (4 - 7 yrs)", Other: "Youth 15" },
                "155" => { PDP: "15.5 (4 - 7 yrs)", Other: "Youth 15.5" },
                "160" => { PDP: "16 (4 - 7 yrs)", Other: "Youth 16" },
                "165" => { PDP: "16.5 (4 - 7 yrs)", Other: "Youth 16.5" },
                "170" => { PDP: "17 (4 - 7 yrs)", Other: "Youth 17" },
                "175" => { PDP: "17.5 (4 - 7 yrs)", Other: "Youth 17.5" },
                "180" => { PDP: "18 (4 - 7 yrs)", Other: "Youth 18" },
                "185" => { PDP: "18.5 (4 - 7 yrs)", Other: "Youth 18.5" },
                "190" => { PDP: "19 (4 - 7 yrs)", Other: "Youth 19" },
                "195" => { PDP: "19.5 (4 - 7 yrs)", Other: "Youth 19.5" },
                "200" => { PDP: "20 (4 - 7 yrs)", Other: "Youth 20" },
                "XS" => { PDP: "XS (4 - 7 yrs)", Other: "Youth XS" },
                "S" => { PDP: "S (4 - 7 yrs)", Other: "Youth S" },
                "SM" => { PDP: "SM (4 - 7 yrs)", Other: "Youth SM" },
                "M" => { PDP: "M (4 - 7 yrs)", Other: "Youth M" },
                "L" => { PDP: "L (4 - 7 yrs)", Other: "Youth L" },
                "XL" => { PDP: "XL (4 - 7 yrs)", Other: "Youth XL" }
            }
        }

        KIDS_EXTYOUTH = {
            :name => "kids-extyouth",
            :sizes => {
                "010" => { PDP: "1 (4 - 12 yrs)", Other: "Junior 1" },
                "015" => { PDP: "1.5 (4 - 12 yrs)", Other: "Junior 1.5" },
                "020" => { PDP: "2 (4 - 12 yrs)", Other: "Junior 2" },
                "025" => { PDP: "2.5 (4 - 12 yrs)", Other: "Junior 2.5" },
                "030" => { PDP: "3 (4 - 12 yrs)", Other: "Junior 3" },
                "035" => { PDP: "3.5 (4 - 12 yrs)", Other: "Junior 3.5" },
                "040" => { PDP: "4 (4 - 12 yrs)", Other: "Junior 4" },
                "045" => { PDP: "4.5 (4 - 12 yrs)", Other: "Junior 4.5" },
                "050" => { PDP: "5 (4 - 12 yrs)", Other: "Junior 5" },
                "055" => { PDP: "5.5 (4 - 12 yrs)", Other: "Junior 5.5" },
                "060" => { PDP: "6 (4 - 12 yrs)", Other: "Junior 6" },
                "065" => { PDP: "6.5 (4 - 12 yrs)", Other: "Junior 6.5" },
                "070" => { PDP: "7 (4 - 12 yrs)", Other: "Junior 7" },
                "075" => { PDP: "7.5 (4 - 12 yrs)", Other: "Junior 7.5" },
                "080" => { PDP: "8 (4 - 12 yrs)", Other: "Junior 8" },
                "085" => { PDP: "8.5 (4 - 12 yrs)", Other: "Junior 8.5" },
                "090" => { PDP: "9 (4 - 12 yrs)", Other: "Junior 9" },
                "095" => { PDP: "9.5 (4 - 12 yrs)", Other: "Junior 9.5" },
                "100" => { PDP: "10 (4 - 12 yrs)", Other: "Junior 10" },
                "105" => { PDP: "10.5 (4 - 12 yrs)", Other: "Junior 10.5" },
                "110" => { PDP: "11 (4 - 12 yrs)", Other: "Junior 11" },
                "115" => { PDP: "11.5 (4 - 12 yrs)", Other: "Junior 11.5" },
                "120" => { PDP: "12 (4 - 12 yrs)", Other: "Junior 12" },
                "125" => { PDP: "12.5 (4 - 12 yrs)", Other: "Junior 12.5" },
                "130" => { PDP: "13 (4 - 12 yrs)", Other: "Junior 13" },
                "135" => { PDP: "13.5 (4 - 12 yrs)", Other: "Junior 13.5" },
                "140" => { PDP: "14 (4 - 12 yrs)", Other: "Junior 14" },
                "145" => { PDP: "14.5 (4 - 12 yrs)", Other: "Junior 14.5" },
                "150" => { PDP: "15 (4 - 12 yrs)", Other: "Junior 15" },
                "155" => { PDP: "15.5 (4 - 12 yrs)", Other: "Junior 15.5" },
                "160" => { PDP: "16 (4 - 12 yrs)", Other: "Junior 16" },
                "165" => { PDP: "16.5 (4 - 12 yrs)", Other: "Junior 16.5" },
                "170" => { PDP: "17 (4 - 12 yrs)", Other: "Junior 17" },
                "175" => { PDP: "17.5 (4 - 12 yrs)", Other: "Junior 17.5" },
                "180" => { PDP: "18 (4 - 12 yrs)", Other: "Junior 18" },
                "185" => { PDP: "18.5 (4 - 12 yrs)", Other: "Junior 18.5" },
                "190" => { PDP: "19 (4 - 12 yrs)", Other: "Junior 19" },
                "195" => { PDP: "19.5 (4 - 12 yrs)", Other: "Junior 19.5" },
                "200" => { PDP: "20 (4 - 12 yrs)", Other: "Junior 20" },
                "XS" => { PDP: "XS (4 - 12 yrs)", Other: "Junior XS" },
                "S" => { PDP: "S (4 - 12 yrs)", Other: "Junior S" },
                "SM" => { PDP: "SM (4 - 12 yrs)", Other: "Junior SM" },
                "M" => { PDP: "M (4 - 12 yrs)", Other: "Junior M" },
                "L" => { PDP: "L (4 - 12 yrs)", Other: "Junior L" },
                "XL" => { PDP: "XL (4 - 12 yrs)", Other: "Junior XL" }
            }
        }

        def self.const_find(size_chart_name)
            const_name = constants.find{ |name| const_get(name)[:name] == size_chart_name }
            const_name.nil? ? nil : const_get(const_name)
        end


        def is_shoe_size(size)
            !size.to_s.match(/[0,1]\d{2}/).nil?
        end

        def is_outfit_size(size)
            ["XS", "S", "SM", "M", "L", "XL"].include?(size)
        end

        def get_chart_size_display(size_chart_name, size)
            chart_size = nil

            if is_shoe_size(size) || is_outfit_size(size)
                size_chart_const = SizeCharts.const_find(size_chart_name)

                unless size_chart_const.nil?
                    chart_size_mapping = size_chart_const[:sizes][size]

                    unless chart_size_mapping.nil?
                        case size_chart_const
                            when STANDARD, CHUCK, JACK, WOMENS
                                chart_size = chart_size_mapping.map{|k,v| "#{k} #{v}"}.join(' / ')
                            when KIDS_NEWBORN, KIDS_TODDLER, KIDS_YOUTH, KIDS_EXTYOUTH
                                chart_size = chart_size_mapping[:PDP]
                        end
                    end
                end
            else
                chart_size = size
            end

            if chart_size.nil?
                chart_size = size
            end

            chart_size
       end

    end
end
