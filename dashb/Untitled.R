print(getwd())
setwd("/Users/dflores/dariofl24/git/dashb")
print(getwd())

df <- read.csv("sales_data_sample.csv")

years <- unique(df$YEAR_ID)
countries <- unique(df$COUNTRY)
productCodes <- unique(df$PRODUCTCODE)
months <- unique(df$MONTH_ID)
productLines <- unique(df$PRODUCTLINE)
dealSize <- unique(df$DEALSIZE)

print(years)
print(countries)
print(productCodes)
print(months)
print(productLines)

df2003 <- subset( df, YEAR_ID <= 2003)
df2004 <- subset( df, YEAR_ID <= 2004)
df2005 <- subset( df, YEAR_ID <= 2005)
print(nrow(df2003))
print(nrow(df2004))
print(nrow(df2005))

countries_frec <- function(df, countries) {
  
  for (count in countries) {
    print(count)
    print(nrow(subset( df, COUNTRY == count)))
  }
  
}

products_frec <- function(df, productCodes) {
  
  for (pcode in productCodes) {
    #print(pcode)
    #print(nrow(subset( df, PRODUCTCODE == pcode)))
    print(paste(pcode,nrow(subset( df, PRODUCTCODE == pcode)),sep=","))
  }
  
}

months_frec <- function(df, months) {
  
  for (month in months) {
    
    print(paste(month,nrow(subset( df, MONTH_ID == month)),sep=","))
  }
  
}

productLines_frec <- function(df, productLines) {
  
  for (line in productLines) {
    
    print(paste(line,nrow(subset( df, PRODUCTLINE == line)),sep=","))
  }
  
}

dealSize_frec <- function(df, dealSize) {
  
  for (deal in dealSize) {
    
    print(paste(deal,nrow(subset( df, DEALSIZE == deal)),sep=","))
  }
  
}

dealSize_frec(df2005, dealSize)
