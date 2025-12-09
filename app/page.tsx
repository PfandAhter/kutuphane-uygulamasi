'use client';

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";

import Header from "@/src/components/ui/Header";
import Sidebar from "@/src/components/ui/Sidebar";
import BookGrid from "@/src/components/ui/Book/BookGrid";
import Pagination from "@/src/components/ui/Book/Pagination";
import ResultsInfo from "@/src/components/ui/Book/ResultsInfo";

import AuthenticatedBanner from "@/src/components/ui/Home/AuthenticatedBanner";
import GuestBanner from "@/src/components/ui/Home/GuestBanner";
import MobileFilterButton from "@/src/components/ui/Home/MobileFilterButton";
import QuickActionButtons from "@/src/components/ui/Home/QuickActionButtons";
import BorrowBookModal from "@/src/components/ui/Book/BorrowBookModal";
import ReturnBookModal from "@/src/components/ui/Book/ReturnBookModal";

import { bookService } from "@/src/services/bookService";
import { BookFilterDto, Book } from "@/src/types/book";

//https://www.yarininumutlari.com/wp-content/uploads/2018/09/Atat%C3%BCrk0.jpg
//https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSceuqfKEPvTl7RgSlYUME8Qi5hXCUIxgTw9g&s
// Alternatif link: https://upload.wikimedia.org/wikipedia/commons/e/ea/Mustafa_Kemal_Atat%C3%BCrk_signature.svg (İmza istersen)
const BACKGROUND_IMAGE = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUTExMWFhUXGR0aGBcXGRsgGhkaIB8gHRgfFxsdICggHx0lHR0fIjEiJSkrLi4uGB8zODMtNygtLisBCgoKDg0OGxAQGzElICYwLy8vLy8rMi8tLS0vMC0tLS0tLS0wLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAKgBLAMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAAFBgMEAAIHAQj/xABPEAABAwEFAwcFDAgGAQMFAAABAgMRAAQFEiExBkFREyJhcYGRsSMyocHRFCRCUlNicpKissLSBxUWM0NzgvA0VGOTs+GDJWTiNUSEo9P/xAAZAQADAQEBAAAAAAAAAAAAAAABAgMEAAX/xAAyEQACAgECAwYGAQQDAQAAAAABAgARAxIhBDFBE1FhgZHwIjJxocHhsRQzQtEjcrIF/9oADAMBAAIRAxEAPwDlV4snETGQAk8MqotWNbhOFBVGsDIdZ7R30zKYCuUSd+DTXSjjFmShteFIEstEwAJOMSTG/prMuSppZLMREM8mOchMzmFiSN4iCKt2QoVMtNZE/BPR0njV2/G5fcHz/UKF2aZV9I+qnuxF7MAiELXZkSEBCBpmkQfhb+GVRWW6FKSlXNhWHjvMbx0canaAygnIoBJ/rotYDLTXQGvE1PWykDxmpOHRsZNdCYEsLCUrStSUrAwLKFRCgTGHf20yi8LMDBu+znIGQANVBPA8aCWLzFfQb+8avv4cYwgDmpHbyiaV2JMOLCukQtZ7ZZFGDdzOsTi+eEfE6ZqW2XYlq1sKQ022lRCkhBnLk3gZJSIJKdM9B2C7PAInTGZ/3001XzBcsRGmE92F/wBtICd/oY2TEq6SB1ESF3HCucSokkQEzoc9+lWTcbaVICgoYyACW4GZA3q0zGlEU2hbROKQpQV5ucEkaZiI7akvW9Eu8hhBHJYMROU85GmfRVsbErMuVQGkVu2T5NYQgcqYKjEJgAAnJR4Eb6gs9xYgkhsALJCSSM4OHszBGcaU3MPpctRwmRybuYM/ARvqvZkQ1ZgPlFafzV0pyMJwRTAq9lHUhJLBhZhJEGe7TtihxsCgtSDZTKVESXcMwAqQOSOUEbzXbbGnySOyk68v8e2N2EGMvkx20ozNpuE4hdRMbuRakBYsyYOKPfGeUz/A+aaposAUlKggwoSMjXZXbA2lokJAgAg8CoHF3ye+kfaVXlnR0uelX/dEZjpuFcIbJpuLqGQLI5Ayx/gNC2Gs/wDb+6unXa5I8vOmIafyjSnZ1jHhI+J15IVUw92ZsxoNKy3d1llhtUkYl4Tkk/DIykGphYZAOLVa0+a3onFHwfm1vYgeQajTle3zz2VMjFhTEfvHY6/KRPRS3vNioOzvwihf6VZoLhKQUkQEjM4huFV7DdhWFFRIwhW7hh/N6KuXmpRK+Uwg8yIkiJVxqW7VZupGmBZ7fJVpshdp5IUPmAbeS3YgNtLhDaoC1ytOIynKNRlA3VvbbVhBIZYyXh/d9APHprZnzHP5Tn3o9dRXiPOH+p+EVLm+8uVAxWJqPKoAUhoBbJXzWwCMtAapXDZgXkLmOTSVREziIQQPrTvojd3mtj/2xHgKqXAkkq6Wx/yJNUG11IuNgYuOMCTugT2zGdXxYEt4FKAWFICsOY16Qd1QrQVKVhEkpJ+0KPWqygNslRSJs6Ynjw66oW6TNpPOV7/uxqyuBBaQqU4p5RwbyIiTw1oaphBBUGwmCBAUozImZJ6NKYP0iIm0pH+gD9pdB2EDknPpJ+4aGMkqCYzmmIAHoILUEkwE58JyPWa85EmOanMTv4TxqSzohyO37JNWEnzfofhqhJAgxqHJuU02adcsgRHTxzNRuIjTd0URYIyjclv1VVdzKusVwN3OoACpWcYgHM5T6CBUjSOaKmcjnTwV98VqnQdVC9owWmjOowsjjhz3ZCjpeTyZGJM8i2mJGoVJGuvRSVtA4tLhwrUNMgTwoV7teHw1d5qIxki7jHIASKjTejajaHFBJUCoQQCRECYihVisTu9pclQPmq+bO6h6bytG5xXfWC+3/lV95qgRhyqL2iXvcPM3e4IAaXumEqj4XRRawWRxLSJbXIwGAkzlM5UqWO9bW4rA2txSuAJmjCLHekAjH3mai6sDuRNOPOukqAeVSzY7sfAPkXPNQPNO4ndGdXnrA8pYIZX5qR5p1xJPAcKX7xevFhIU4p1IJgGVRPD++FWNnrbaXysKeeMYfNUrfOvdQKNWqxOTMoIWjDabotEjyS9VHT/USfAU13hZ1H3IrCeYhWLLzTDmR7x30BYup9Q/e2k/+Rftqew3a6h1JUp5Sed5y1keaIxAmAZJiol6B3HIy7HXQrqJFeNjeWoKbQogg5x0iNeqoXLteKFSy5i5sZanGCdBllxpCtl62ltZSH3QJy8orTvqMX/av8w9/uL9taUxuoFVMWTIjEg3Ot3HYnEPKKkEAJdExqSlAEdcHuq4zZ1BtkYTIWokRoC44RI3ZEHtrjY2htf+Ze/3F+2pmL6tqzhQ8+o6wlaye4Gg2Nyb2nLkxgVvPpOzW1sNpBWJESPGlK8EE2xtYBKQgSrcOYBHXNchXa7wAJUu0JA1KiseJqp+urT8u59dXtpBgeqsQnKl3vPpF+2t8kpOIThTl00m33ZVOPOqSkqBKoI3yUkeB7q5G1eFrWYS48o8ElZMdQqabed1p+q7Xdg9abEZMyK+sAzqm1LSng7yaDKiIBgT5MidY1pbRc74WDyeUp3p3IUOPEigrhfF2L5UuIWbSmC5iBAwDjnEz6aoObM3oACEPEHMEKPtpUxEAjUJU8QBQCmN9nsb6UoSUmErmITpKiTM+jpr1LT/ADeaYxqVoN5V6jSQ5dF5JBKkvADPzvVMmhH6ye+VX9Y1QYWPIiIeL2ogxwt1zWlZcPJqPmxJTJzVMd/pqe77neSXZQRKVASRmTgjf0HupJF5vfKr+sa3F4vfKr+sac48lVYklzYw2qjHdV2O4VjAc0LAzGpUCN+8Vl4Xa4oqhBPPBGmkClm7m7S7EPhAPmlxZGI6GMjvy68taI/qK2f5pn/d9opezYG7Er/UKU00Zdsl2OgCUkeRKf6pyFZc1lU0VYkweS0PHEnL0Ghlpue1IGI2psgaw8MhvOtXbRsbb4xheRAI56pg8cq6iOZEUuGFAHaDrLd7yVYi0fMiMtZGVXrew4tLY5OMLaRkM5jOenqrX9kLw+U+2v8ALVG9rmtdmb5Rx3KQMlLnPhIFHm12Lik0hWjXlDu3bRctCVt88BoJlOecq9vpoSmyKDS+bmVJgb4wwaXf1g78ov6xrP1g78ov6xp1RlAEkzoTe8JWewuBYJSdfwkVMmxrGHmnzIPXhquxZn1ieXSnoU4QeiRnXqrC7r7pb/3T7KJs9RGQhdwDJGrKuRkdEa9ETUK7KuTkdRUL7DiQTy6DG4OSewVWs5dcVhSpRPWaIvnELKNqMuvWdRBy3H7wPhWIaMCRUSrA/wAT9atPcL3T9au842ve6hq+G5ey3BJ9AqawW59xzk0sIJzMlpMEDpjtqrtMmXN+g0MfBovs28pDDi0mFDk4JE/G41I7LccfNUtXpsu+4jE4WW1CMIQnIzlJUI4aQfTSuvZhwKIU42D/AFflrrd7IIbTG4J/FQEIJVMb/VUTnZeUqMKvziJYbsUy6lSlkJBIJaUQojfhMeNO7t5sticdpOU81aeIHRvUKDXqmCr6S/E1d2mbICMtUq++1R16yLgKdmDU8va1tPgoIfIQTiDhSpMjLIZ5569dS7CWiz2LGbThRykQJUSQkfBKcXHOar3UkFx/FH8TzuOIdOtGlthaYCcwhMEjipOmVcxCnT0hRSy6usYl7T2FTYWkqwnIK5N1Qy10ZoTYL+D7ikIfZUnnKCEWd1CoGkuLgEjKYAmia0Ty442dz7jVDNn7IhKARmeTOfWRSNo7O6nY9XaVc5obByzmEgkkrjDAOR4kHLOijexzaxZwla0qeUlJxQQmSE6AA7+O6oroPvgdbmvWKbrtA5SwD56PvoqjZGDAA+6M5cSlWJHuxEx7ZnkbQptcqSheFRiJExMTlx1pwuZxDSeSacdbTiVCQ2lY4+cVjwqHac++bT9P8VeXa8JEkZLUfs8KORycdynCYVObT4fmFiHLSkMt2ky4I57KQIJwqkhSo14UmMbGKWha0rSQkmZBGgkxE7jT1swPLMdI/HUd2iLI9luVP+2KzpmZbqauM4VARXdEvZ9lyzuktqwKIwmIJjzt4IjKn+57Y45Z2lqWSpWp/qjTqpPXYVtmVjCcXmqkKjASDhI0PEnspn2dc96Wcf351NxRtQZL/wCcn/IVPKpQ2yUpbRBOKLQgCQDlgnQ9ZoS5YHUKhGCMIVlyiDJJEShXRwojtU7hbWTutKP+MVBaGm3XUqcaW42EpSCjXFMkRIOik59VTwswruluKx49LH/KxW8pC0WkDnLdQnQlNocVH9Kxp0TRW4rxXgw4uUUXFJTLLZOQmJKkgZCesmhl4WSzAqDVmdSpJSecfNGISVCau7KZugxA5dzIT8n051oyNpQsBMWDHryaSZW2rW443CmnjiEBtDaEhRxTJCFqJIjgdNKAXRczLgbddBS2VYVJSTi1iZOmo3V0VaPKs9a/BdLLFk5ZbbIOHG8lExpiLecUvD5i4qNxnDjG3htzhO9tl7PY2i4wgFRMHlcSxEEmACmDlrPHjQ1llrk0rdQM8chpKxBQopyxOjhTh+kge52QgkyVagD4p3T00rOtww2Ol775pQzgfFzhXGh3UbSlanrEAeY95s5CeEZF3pqr7uWcGK0PBIxSMa8wDGZChEZQINQWxyUwQMmQd3BO7XvqN8afRX4itBWqkMZvUPfMQ3ZnAtYQl1wqKgkDGsc4iQPNI0oLtjY3MSGwVKUSQUYyQYzBghKZ14+iilxD323/AD0f8RqztIge7LOROZVr9E0oam8oXQVU58q6nRq2rsEjvGVS/qN5JBUjKQfOTp3032lcIUIJk68Mv+6r2tADTJznCN+XnHdTDOTFPDqOsGptzX8RBRoBCErJI1nnCDpx1q9Z7G24AUpWQQSPIoiBM/xOINBbanryWdeynnZJHMY6Q8PvmhkOkWIUsmjEy9ks4FIAUFDTyKU5g8Qo5dVQ3fYMIGJUYgSAEg5DWZIOU6UQ2gb8o59FftHjVy7bOhbeJQkpxAdRCZpg1JJsvxwaqyjMysxrCU+tdVA43xc+qn81MSWRgXGkHxFKiRXI1yhXaE9plhLsmNBrPxctCKKXAZszxj5IwP6qoX9eTrK4QRhgapBzgb6Fjaa0cU/VFdoZloSZdVbedpvoAJAPxUeKqANnymvwvVXOBtXafjJ+rW42vtXxk/VFSbhnMqnEosY77Tmr6Th9Jq9tKRhaJjzVRPHE2cunLxpSG2Vr+Mj6ia3G2lt+On6ifZTLgcEHbaB8+Nr57wpYVFSnsjnjIH9aTTZs4Od/Qn7yaQP22tw/ipH/AI0eytxtheJGIOHDxDSI78Ndkw5H7h5/qHFxOPGpXfedTW9K7QkTiFmcIy+Y2B6RQ64lKwAKn91v/p9Nc5/ba8Pl/sN/loxsptLa7RaUtvOlSClRIwoGYSY0ANK+Fxj3rb33QY8qHJ13998q2CxvcuIZc1XmpKgmCeMaU3XcyoOXfKSIUictOcjXhXP7VtTbULKfdCsjGiezdWg2xtvy5+qj8tMcLsQdpwzooK77x62jYUq02qEqMryyPxicqpWRhWLzTqrd82lQbaW7/MH6qPy1uNtLd8v9hv8ALTHFk06dvflHw8WmPIHozpmyx8syIIgZ5fOBqtd7bgsz46Fdsornn7aW75f7Df5a2G2Vv+X/AP1t/lqP9K/h78pbiOPTKboiNVuvN17z2wVBchyCFFIQAEnTLfM6mj1wAizMAjh4mub/ALZW/wDzH2G/y15+2Nu/zH2G/wAtPk4d3XSKHv6SXDcYmFy252r3vHLa5Ci04Akk+6kmACcuSGeW6qLLywUKlaClRKRyZInLM9HN38KHP3/aTd/LF2XPdGEKwp83BpERrNAv2rtny5+qn2V2LC4XTtt77oufOjPq33998dbcoqKnC4SpZCSEtxOYIBmebzc46ONXNlklLkEEDl3D0RyeVK1ht9sW0HV2ooCjzQGQqemQmB1EzlUotNqVkm0uK6rMg+ulyISumx78o2HIEbWAT6f7jvehILZBIhSsxqMl0EuyUWyzTp7pb8W6Xbfa7U0k4rThXEhDjTSVEdUk7jGWtXNjLY7aeV5VwkJwxCUDMzOieihjxnEurY1+Y+fMM76aIJru6X4x/wD0uELwBBCjKjAIPwTwpcvBQDSIg/vvE0hW7aC0BbiQ5CQpQAwo0kgZ4ahO0lq+V+yj2VU4XbfaQXiEQad4w2hCijQ/uBlB15lY+CYIB/dqHbIoLYL8tLjiEcr5ygPNTxz3VYv68nmXShCyBuBCTAkjUid3opyrXUVHVQW397xmuIe/G/56P+OrG0SfflnjTnZ9hrnxv+0b3Psp9lbN31aFEAKBJOXNTr3UvYtd7QtnQ98dlAltevnAR2VTvBs8kyc4w6bslKqibvt8TLZnPd7KhXZbeNyPs1NUrqJRsl9DKt5IImfjA8Ms/ZTxsgDgs/03R3pV7a5/bLxtDSsK8IOsYU1Ai9n1GBBPAJE+FWbGzLUgMiq3WMO0X75c/FX4Cr9xolhzKTJj6opebYtytGVdqAPGvLVYbWgArCUzoDh9nTQ0babE45BeqjGdHmrBEc0+KaUkt1Cpt/o7k+yoVrdBgkfZ9lMmIr1hOcd0bLfYmXXSh14tyExDal7vm6aVANkbIf8A749rDg011qw+YtSSOCR6DR5tycQIGq9w49VSOUpQEPZB7Jis7sa2UgsWoPEnRKDwOeZ/uaXLfYiysoOfTETx7q6jse75BqOP5qo2q721OjG2lXO3pB39Nd/VEMbhHCBgNMRrusSVpKjMYgmR6fEVeRdOFSDKSCsAApn4QHOzg9VFbZZkIdWhACQFYwAOAkxHVFSvnJr+b+JNVGQkymThkXBqrex9wTLL1xXglhNoaVZ22lBMYUISrOY0b6ONa22xrAQpb765SVQpwwCMOgTHGn1I/wDSWf6PEik++ljAjL+GdP6OmnxUwaxPJ4pRjfDp6lr8gD+YsOXGtwIW64IXmmJmIkSSn1mruxlgCLU2ZUZSrXTzT0UQTHJWf6A4/FFZs0U+6GAPin0oNQDlka56+TAmNk0++UFIuNNqtLyCQlKFuxhAxc2YE6RAjjV3Zq5UKlsxhU6hJGIglJUAd/Ru41Ls4v31aPpv/dcNWNk1+U1P79vfrz99Lkdgp8p2PEuoeIM1uG6mUJewIPmAnEZz52k6UOu/ZyzuLIUM+fzUlQKcJAEmYznSmixnmr/kjwNULtV5YgHe74o/vupe0bSTcVMSlhY6iKtluBLq8KMSSRIkgiAJOon00eV+jK0BRAcagfGKhPVAO4HhupwvKwNpsNjUE5lHE72VKPZImma2rwrPSJ8R66fLmZTtJphUjecfsV4OrVhKGoJPOKEwObiiIJ0yo8u77QlDTkWeHUlSd2QIEGG9TNBrjAGEEc7F52enJD+mm6/rWWrLYSAky0vzutHAUzOxbSsdMWMYw799RZva7lGypK8Ky68XMIyCYCm4Gk5ontoHariaUAAnAQ2FnDvPNB1nKVbqarwdmx2YmBixHWBmt00MeVMbxyA0niipq7C5rx4sbLuIduZaWkMsMw2lzAsiMRlYSVEY8Qo7DoYdUHlhQUUpIQ0IGFJ0CIOZOtCrCk4LEqcilnLuFHD+4eH+or7iaytzigb1OZWu71294cs8oqSjJRSiYDmGISEjfNMFguRNhfdsyVYhhSoqIgk9UmNaH7O/vldDS/Q8KP3+7/6kuN7fgU1fKx+XpUnwyCyeu/8AM51b7pbRaEBZUpLkkwQCDqQO+ha7BCiMUQSMxnG7Sje2C4Wyfmz901QvIeUB+Mme2K1IxIBmfNjUEgdK+4kl0XWtDmLE2HELSlCFE89RMfB3DfmKZL/sRdsZgJxh5ZneQkExx6qY7GEFprmpzDc80Zk4Zmh1vaCLIelxRPalRqQy6mud2Wla74m7P7JPWhwJ5qCDmHAeszlwpjTcjJ5KGUpK8UKSpQIwhXAb8PHfRjZYxak9OLwqrZ1ibPln5WcuHKDWi+QmcmNRtPbx2MU3JFqdHNCoClHXdrSxY2LS64ptpxxRAmeVjLT4XTXVL/RzFaiW0adQpB2PV76c+h+IVPHkJDE9I74x8IHWJt7MuKJUpWIp5pxKGIQT3jqrWxWNwKSZLehxGRA45Z0Reux21OqQ0kqIUsnMZDEeJpgu/ZvAiHg4pf0hpujIwOgmtZcBZlCEttKZesyeaVlZAEqPLGTv3DfNTNIacbUpttBSnzjgVl9Y0U/Z5o/w3uyD4A1DZ2EMNPtpDkKSVS4kgkxBAlIyAjvrO1VYuaFDXRqK93XYQDKEqCs0zBMDPojTjW1pticUKTmPmp/PRSzKgNH/AE1HxpbvEy4o1ZCWJuRcBRtGN8zakgEaJOvAGmFoEHoKlacKUrdeTyHcKMMEDMpnOOitxeto+M32tq9dSOBn3FessMgW+ca9iSrkGiBvPiqfQZrS2WohalQTgWrdwVSe/tLaEGPJHqHqmRW6drbTgxy3qQBgO4Cd/SKRuGYkmOnEotS9ansTzihvxelJrHXhhTPwVhRO7Xh2UN/be08G/qf91t+3Nq4NfU/7qoRx0+85+KRk0eIPoCPzOuWZU3O0rdKc/wDyEUk3rBQ1zgJbVw6BQSzbfWqCChChwSmI69aIsbX21QkWQkccJj7lMhyIDsN/H9THmx48xxnVWkk8udgDv8JEhZ5NmdMGXTkO+vdl3ffLOQGR7eaatm/bzKVKFnSlI3KaJPfkKp3RtXaHnwy8loAhU4UQoQOM1KmCtt95ufKrsvh4T3Z60BFqfJMeWd4aQsb6l2WtCeWAkTy7YGevPmtmLZeQUWgUgoABCW0EJB82cJyyGlTuWu9Bvb7WlD1Urm7G3r+pyNVEXt4fuXrsbKeVne3I9NVLqcSq0KwlJzc0Ofwd0adM0tK29toJEt5fMFeK26tm/Bl/pij2OSiNt/H9Sa5sam7PPu7vOdAvy+EG7rMlOLEgQciBk0tJhWhzNO1rQCqY+B+b2eiuRovW9SlKuTEKAI97unIiRmER3Vir7vXI8nJOX7h7Lr5ulLkRm5V6/qFHUd/p+5RuS0SU5jXQfyRvxT2R27qaduD7xu8/6SvwUsubR3iknE20mPjpCPvlNes7UW50hA9zrVnCUpKz0wEz6KqNQfXQ9f1FZkbF2dnnfL9wpff+DsQ6E+kOH10PSkkIHFjwUn2VYd2ifQwl0oaW4XC3hU2rCIB0ScwoER2mvbPfN4uAKTYmY3EMORHRFS+Lc+J6zXiyBQAN+XSMl3HyNh/8Q+0BR1afIv8A0z90Uhu35eLYGKyJgebhYcMdQJGlVrVtdb0pnkEwdcTDie/nkVPsWPKvWI2QKdwfSTXCCHnP5LvoeTRzawxeh3Sgj0n2UjL27tHyVnH/AIz+ar12bR3ha1ENWdlxWplPDpUvpqzYXLapHHnRb8YP2xIJZ+iPupobajKGVn6J7o9Rol+urUtJtIZZKQQkqw5AmAJBV0jvFXm7zvEiUtMRuKeTjjqFR2VUBlAG3rJ5HV2J338IZuu9Gi2ykOjH5Lm5ajDIre2OYrOtEgqSr0YVDTsoIb4vMbmR2tetVBbRe1pa4AKKoy1zjLOkXEen8wtkHW/SPFyWjDaWZyBUoST8wmql3v4nmExkC/nxzc30mHaV/fgPZ/3Xo2leG5HcfbROJiIoypfP7Tte0KvJ6H92jceA040gbFpm1u/Q/EKXmb6tbmmGeBJB6NVVubRbkmQ1nxSD4g0i4WUEd8ocqtRF7eEK7O2u0MWh1TbZhWIFSsQTGKRBiDW16XzbC4VG0JRJkJIGm4SdYpeettqORaM/NSufQaGPW5ZPO1GWZVl3mtASzcVcuNRTC/URn/X1rB/xaewp9lRPXk87JW4VwlUc5JABGegHR3Us+6ldHp9tbJtqhw9PtrjjJgOfH0FecbLJmlv+WR40uWwc9XXViyOvrjDhHCTHiYqY3daviNn+tH5qCqVMmxDjaMVw2RD1pDbiEKSUTmhJVIA0JBy6K32VsLVpcWhbTQASSClEfCAG/gazZBybYk/MNTfo8Pl3PoH7wpf8TGfZllLbS47PZ1AJQZUknXKZiBOg76AXbZ0lTCIyLuYMKkFSEkadFNn6SHAHm5+IfvGla6f8QwNRiR6Xp8Ip0+WI9aod2luRgWx1CW0pCTkBzQMk7kxxqxtPs1ZWRZ0obI5RsFRxr84hOcEniam2pcw25/r/AApq9t+YVZOhtPikUlnVXhCtab8T/MXLs2NccnkXy3KgmM9d0kEceFF/2YtLS0tutNvgp/fFbmsEhJlYzgcI0o1scebP+qn8NM+0M8gMOZnKPoKrMcz3RmsYVG4nM73ukMtcr7ms8Ygn4ZOc/wCp0VPd9ylKGrQSgBYJCEIUImRqVn0Cr21VqK7MQZyKSTGU4hA7idKtWY+8LP8AR/Ea4Oxx2Z2kDJQi3e9scbtdowOKQTgBw5TlRi+L2fTKUuqSBiiOgZaEH00u7Rf4p8/yz9mi20o524ed4VrKAncTDrYVvK+zdmDi2wsJWhTazhUJSSFGCUwRPfTLeFzWdNlJSw0CTnCE5wTG7opZ2Me8oyJ0ad+8qnW8Ve9AfnHxVWbiSQdpt4EBsgsXFfbhHJNsraKkCBiwKUkRGeSVDSl9i8EKUlCbQ8tSiEgDlsychq8AKbdpmMaLONQUDw8KTrEsqtAAPNZbJTOgOHCg/WUijwzXj36ROIWsm0O7F3Ryr7jjilLCLOogrJMKUYQRKj4nSjex1xsMIDiUgrxKSF7yhOY6MwRJ6Kj2VXgsVsfjIKwp6UtpLn3zFX7glNnAOYwH7SikfZAoZWOlvIQ41GpfMxb25aSQ2jTygnCN+BRMx10sIbIyTynYlfspyN4eXLmJKAl1YxlKlYISUSlKOcTIjLcTRBm940vQn6SXk/iFPiIVaM7KjMdSiIbdldJyD6upDh8BWlusryUHlC8lJy8o2pKZ3DEpNdCN7K3Xoj/ecT+Olvbe2Lcs5C7W2/CgUpD6lqBmJCTO6c+B6aqGQnn9v1IsuRRuPvIP0Y3Ay+suugqwKgJnm5JxAmMz1aHhTjspaCLfaWY5vKKKeAAxgBIiIjwpf/RSsDEBvUf+NVH7pOG+H0/GW7HYV12Q3YMXEDzHvlAVoutLd1hsH4cYiM83GzGVROWdH6vsxwpzkkxqY1PTlRm8k+8F/NeSezE0aFOf/TLN0EjxrMGJA+s15UVWYAQps20EtEgAE2Y7h8oKR7+bAsyYGhP3z6q6HsugciD/AO1P/IKQNo1e9USIj80+uuwk6z9R+YmStPl/qDbosja0EqQCdN/qNQ21hgKUAlQIjIKyz4SCatXIfJnrqk+nE8sHorSpOo7ymdEHDqQBZ/cY9m7M2lGPDjJMHF9EHUHpq7tI+ywtKDZ0OSCZJIiI6+NVtnD5AfT/AAoqltamHxmTrEmd4qfzZaMzDbFYhu770ZIwe4mzhGaio5xOoAy0qg5fDREiwsZkjOToY4VTupZxGenLtV7apoVzEdMn7ZphzlyBov6/iNtwXQy0A6dXGQshOqcScRgaEDdI4Ur7QoSLWsAACU5DpSCacrCwVcikZe9gOgeT30m7RH36vrT9ynUzKwEYL6sSG7KXEAJVgCgQACJKR/fXSLjOemvAeyn7awxZFD5rQ+0KQEq166OPcQZNjGW472bszodUQSARhMjXfOfhUuzl+M2Val40rxAiPNiSDwPCg7t1rdRjQJgx66GG7HpI5NRjgJ9IoAAg7xnY2DXKN20l7sWxaVcoGylOHWRrPAUMsKGW3W3PdCTgUgkRqEkGNd8UKsti+MSnL4SVR6CKsCxo1DiDGsA6d9ELQoGLqs2RGq8b0s71oce5ZKcZkCRlkBmZz0q1tLfFntZZIeQgNpSkyQZgg5ZiNKQ3mwZhQkbhTHs7cDWa7akFCkjk/KhPSZJUndG+kZa+Kz9o6nV8IArn1jNcV9WVgQX0K54V56N0ZZq6KYLTtrY1hIDiBhUDmtvgR8bppNXZrkTkoEdS1qHelRoHeVjszhV7jaK0jeMWX0isxPZWfslJ6+k0nIR3esdtpL2stpZU2h5pKlKSZK0EQOgKqFNraFlaZS6ha0CDhKc8ycgDNcotTRSohQg8JBjuonsp/iB9E1U8OFTY+MkvEXkFjflGS9EWd5xbgtTYxhIglOUD6VW72fYe0tTSdfhJ4RuVSremzD7SS4QkpxQMJJM8NOzsq5Z9mw5Z2FoHPWlRXiVH8QoTE5CBBPb1VQLYvV/EiSLrR/MO7Piz2dxtZtTSsCVg85OeIk71bppjtV/WRbHJcu3OKZxojWfjVzi07KPASkJjMeeMyADA7FDWjNktL6UIAtNqjCISmzSkCNEzlA0yyyqOXHq3u/f0l8GTszq017+sYrwvGyuIbSLS0MCSmeURqcpGdL9ku+zt8r78ZJciDjTkASSPO44fq1bbctak4wbWtIMf4ViZ6EmVHurW1WK0OtKCmygEefabOwhI45hOIKiYgTSpjZRQO3vwju6udRG/vxhJF4WdN3ixptDOKSVr5REGXAsxnOgjt31YYvmzoRhD7WiB+8RBwgTv3qE1zF+4rQlWHklk6jCJkccs466hYu11Skp5NQlQTJSYE8cv7g1U4Aw+bxkBmKn5fCPbK22kKUVtOFRWUkqGArUoq1ORIEihC78J/hs9yfZWbR3MphDdlzUoKKuYCcjMdO+hCNnnvkH/AKoHjTYwCLuHJkINVCDl7E/BQOogeEVCtwOGCUAE/DUSE981WXcDgEll0DiSmO3oou9dtmbOBQbXGYIcVvAMSBBimahAmp9vzDGyNpYsiipb7JB3IUNcKknUjiO6rllvmzIvBy2cugpUpagjEmQFBQzOLp9FLYs9k+SR2LcrFt2YaMgdrntqPPqfSVGOug9Yx2q/rMqzuM8qmVkGcSY+DqJ+bVNV5se5G7OHUygk4hEGZ3YumlNxViBy5fFM83AUcebPOijJtzIGVlUeMrMfdNccNAVcHbaidVRiuvaRlpARik8kW5B4qCpjs40qXpaW3WUo5VAg6zuy9dQXpbklBAZS2TEKxkkHXTD0UKtbOIBYGEE7953xMcPTT48IG8m+XoIVsyUNJgOtrznJQHoJquiyJUpS+WbTJyBImpLr2ebcVCniRBPkkKWrL5oGnTNXndkrMmMVtKJ0DrDiCerFrTbA8/tGbK7IFI2HjLF2uNtoCC62edJ52ohIj0VXvZhlxwKQ6hKRuJz1mtXtl7Kkf49BVnhAQczw1paesS0jEpMDrHhM1yoNVg7yZYha07RnsaW0Ey6g9Rqo5ZklCU8qjIcekn10Fbu11QxJbURxAmvP1e7IGAydOnqpuz63O7ckVU6Pdm1LTaQFlOQwjCoaYMImYzn0UrWzk3LSp0uJwKMwCMWkdVUm9m3SJPN6FA+yt0XcW1ALUCDEQN/jS7DkYbJ5rGDaC+mX2S2hQBJTmop+D1GlT3MPlUd9SP2cSQHUzwMDxqubKvcpJ7qZdhzitubIjVdDkMq+mfAVcutIWAfnHLjnGdAWrWpDQiOcsgzwgaUT2etUlKcJHPGe7NQ0rO46zQp6Qda1hNqciEgLUNwA9VM2z9mSsKVAVKQCMiCJJnppQvfO0vfzV6/SNOGyTR5Po5unWabJyucDvUoWm6m3rYoOTAUdNDByGmlMl6xyLAMfuh91NCLMmbavPeo/aFEL8V5Oz/yh91NKGJ5xsiKpGnqJzxw81ZKT5rZkjTIZ9vpqQolwgiJcAgiCAeI3ZVXcT5NefwGzp0CpgYdV0O1sPKYkHxD6xgblCYRgAGkNo8SCTVWzmH06ThVoEjdnoBVwnqqi2uX0/RVWIEm56zY1AuO7h8i2cv8AEnxXQ2+BhBHQvfwWFeur7znvVJ4WlXiqhO0LxKljd5X0JFFOZ99ZnI5fQ/8AkzVpzyKeGM/dKfwV0C43ZWyeKEnvBFc5sZ8nG4PLB7HFx/yU6bLuEps5J+CkdxjxqeYb3K4nvEE+v8CGWnMLzoGoUs+gH10P/SBacNik5ypI75q0TFreHEg96G/ZQL9KrsWFMfKAd2KqqLNTMTQBge12kICzmF+55SRugLPfMUM2btCxBSpQUVNp13LWAR2wcqnta8//AMceuqmyma2k8XGj2AuK8YqQFYzNS75hN9u0FdryJkGMicxGenT4UWvnZdhC4TjjOE43Ob5u8qkzNU7waDtug6YlehR9lM20IIXpkQY6fMo6iFAEy5ACSYvWvZ2zthUJUYQSDyi8yCRPncBQa7rMA84hCigYXDlBzTMZqBO6m68UkNqHBtY7lcKWrEItBMzIe9daE3WZdR+8rXbYw8iVrUTJ4DcOAra2XYhBOpOmZJ9FbXAryY6/UKs35zVq64rOWOrznpaV1coBtFkbKEjAkEkSoedrvMxVFthKjOEeZOefCiDyuagxvHrqjYz/AMfsrQpOmSCr2nKXLGw1lKUnyQOYBzxJEjKtbdgxIBAICBlA1IB07TXtgbnJWnJZQfnDu0qvaxBQI0Se2CInsrou2sbRq/R+2kWhRQU5sKyG6VNzOdFdpACGF8qG1JSQCo9CZ3Hh6aA/o1ytKhEeRcP20UzX9ZEuIGJOLABhA1zifCkbZogNic6Q4cTpnVQOWhBKvRWj0FKd+Z8ajdGFTiRuVHcTWgPMT1nxqhEbCdyPCXHLJDOMnzgsgAARBw+qe2vL+YSkJIABxZnLPKt7c7FmbHzF/ePtrzaI5J+lPoq6G03mTMAMtCQ2UnEcJg4TUl6KQHOeFKGWQIGe7+zXl3fvP6VeFaXszicwzkT/AHpWYfPU2ZuVyo4qzn4Kx15+CvVWpDXxj6fymiNhszCCCXEnoGIHt19FVrXYUrWVYzn1es1a5lraR/rAIASUTBkddTM7QYSCEQQZERrrwrQJa3kGPo/mqr7nC1DRAO8iBHRGpoaFPMQl2HIy2q+UFRUWpUSSTOpOZq9ZNri2CEIwgiDEaZ+00Nbu5nTlST81JP8AffXrlhbSCSHB0qAA8K7slPSDtX74Sb2rAUVhEKMyRG/M+mpHtrwsAKSohIwjTIaZZ8BVCyXM2swpYb4EkZk6DOt7z2ZKAOTVyijJIEZAakmchmKTTjuo+vLVzQXlZYI5FcEAHPcNPhVuL0ssk8kuSZ13/WqC6NnnHV4Vy2IJlQiY4TuGteGwstqIW4rLL92FDv5ROe6BI6TT0vKz6xQzDeh6S6b9Y+K93pqSw29la+YleLCc1Eab4g1Aj3MR5+XSwr/+teWfkg5LapOE6IKRHao0jY1ANSy58hIBMN2XaEPjAhl5QCsRwiYUSc1Qev00TfUVmVWZzPFIgwcQg757qW7l5RAnE62gj+CVpWSDljOhGvflRQXsU/x7ZHznFesUjY99gYVymrJEI5gK97O84lRhJ1kEx2gVRs+2ybNhTyTqSjQLSJGeLerjVW17SnAeTtL+PdLhI7RFLj94rzJwrUpRlakgqJ7ZrhhDcx95zZiOR+0dFfpOBXjKFYuOFPRrzuih1/baN2tGB1LoEzCYGee4qI3+FKwffXIAVlrhQB91NbsXc44QFEgnRGeKOOHdT9kq7/mS7Z22r7Q+vapgiCh2MITonMCYznpNe2DamzMlJQ25KfNmDGRA+F0ml0WZQXgShSjMZpjPt07asKsD4E8is/REx0kJ066BwpVfmMOIyXf4hy03+gOB8pUOUEiNQSTM59dTHblGBKClSgkEDEM4OsnGJ0pdvZpRaayPmiRvHX9aqa7scDfKqTCdRMyRMSOifCuGJCN4GyuDVRue27SsEFsmQR5vHM/DqtY7+RiK0WdajmJAURnrljig1muNZwlaClOqjiTIHQCQNM8zvq9d6rC0opdFqV80hCc+IIUaOhBsLihm6gekIM3wEDCmyqA4QfWuorbtQkq57PO1zH/zq37qu2CRZbQYgmTpOQnLjlQ2+LOy8ByFnW0RqpRUqRuyw5RS9ml7ypy5OhkKtoGTHkdNNfz1om/WBowNI36cPOqoq4VATyjYHzsSfEVp+pxvfZ7HE1TQkl2uS7hOzX22TCWYMR2DONarfrdoKktExIg6CTJ31l12FKXhzpiRIHNOWUKGUd1F7s2VbfQXXVrRKiBhSVYhxyBjORB4UhCKd44OQi+sqXdtUhhWNprCrCUzrkYJEFRG4d1Wn9uVL1SdIyEd8Kqsq7bAha0uLeASclRkR1RIPZWzF2WBS0hDrpz0KFZiN5jKjSc6MF5BttKRvlgmeRzmZk66/H414q+GDqzvnf8Ampke2asIHOcCek4h3kmKHWzZRqMTalLTIALZSoemPRQvH4w/8g5QW9fTKgElowBAEnQ5n4XGtHr3aXGJomNJn81QW+5lNqgaRMqhPrql7lUDBEb+iOMjdVQFrY/eSLOTuN/pCab3bBkNZxH9516b+Ek4BJyP99le2e72IBcXHEJUPXB7prb3FZFaOkf31UmlIxbJ1lZV6g/w0n+hHsqI25Hyafqp9lFmLvYTJxBWW8x66FWxhJVzUmIGkcM6caekU6pG0qOU+j7K3tiyENEahOXfWVlHrF6SNFqWSJWrqkxpw0r2JUnt8Kysrjzjr/bMIPrGCeCk+CqLbLXgC44SmQlhZI3HNMisrKnXwxr+OFVXo0+6jkmeSwpcnJOcoMaCky2DnHT4f3RWVlHHOziXLO0EpgFQ7qjs+ThBmcKsj2a1lZU75yxFHzhm33XZ2nESHcgCEoiCenIz1USbvdpOra09Km0jwbrKyitEDULkW1KTpNSG23uHBhbfCJyiEHI5RBbT96lFbMJEHzSozvyOVZWU9KtaRGQllbUen5EcNhLQooeJJMKAHcT41W2qswDRWVKKi9BJOgO4dVZWUp2eAC0Mr2e7QbuLvKOzCuYFcwwuMxE51c/RrY0qdfPOBSlAEEgySfYK8rKV/lMZCSy3IL5tOO1LOoCl678K0p3dVGdq3AHmkwMIaZ5u7PHOXTWVlKBuJoyf2gfr+IlXovE44eIGnXRnZVwC1JQoApcQMjxKU/mPcOFZWVYj4TMZO4krtomQpIkh5MRlzQlwCP6aadn7uYAxBtPPM5jEMwVCMUwI4VlZWbPsu004N23m1+IaQwolpCsSlIgADI4t4E6CudX5bQtyQMIACY6prKyjwsHFcpYu5+EpEnNWn9VGbDa1JsyCDzOVWFDLOIUnwNZWUzgWfrNV2i/9R+IOtq0uPvqUAQlBgEDoM9knvoeHxyfNyPJomOOI1lZVANvSefe584Xu29HAqMWjcjTI5geqib1rWuQVHJKcxEgnEJHTWVlQYC5ZTtA97uwpkTMLiTqcxQy12lRGp80HvBJjhnWVlXx/KJHIfiMoWg5GtLGBJg7h95PqrKyqjlFyHcS1bcggjIkCaHqcJ4dwrKyuTlJvzn//2Q==";

function HomeContent() {
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();
    const searchParams = useSearchParams();

    const pageParam = searchParams?.get("page") ?? "1";
    const page = parseInt(pageParam, 10) || 1;
    const size = 12;

    const [books, setBooks] = useState<Book[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams?.toString());
        params.set("page", newPage.toString());
        router.push(`?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        const filter: BookFilterDto = {
            page: page,
            size: size,
            title: (searchParams?.get("title") as string) || undefined,

            categoryId: searchParams?.get("categoryId") ? parseInt(searchParams.get("categoryId") as string) : undefined,
            authorId: searchParams?.get("authorId") ? parseInt(searchParams.get("authorId") as string) : undefined,
            publisherId: searchParams?.get("publisherId") ? parseInt(searchParams.get("publisherId") as string) : undefined,

            publicationYearFrom: searchParams?.get("yearMin") ? parseInt(searchParams.get("yearMin") as string) : undefined,
            publicationYearTo: searchParams?.get("yearMax") ? parseInt(searchParams.get("yearMax") as string) : undefined,

            pageCountMin: searchParams?.get("pageCountMin") ? parseInt(searchParams.get("pageCountMin") as string) : undefined,
            pageCountMax: searchParams?.get("pageCountMax") ? parseInt(searchParams.get("pageCountMax") as string) : undefined,

            language: (searchParams?.get("language") as string) || undefined,
            hasAvailableCopy: searchParams?.get("hasAvailableCopy") === 'true' ? true : undefined,
            roomCode: (searchParams?.get("roomCode") as string) || undefined
        };

        let mounted = true;
        setLoading(true);

        (async () => {
            try {
                const result = await bookService.getAllBooks(filter);
                if (!mounted) return;
                setBooks(result.items || []);
                setTotalCount(result.totalCount || 0);
                setTotalPages(result.totalPages || 0);
            } catch (error) {
                console.error("Failed to fetch books:", error);
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => { mounted = false; };
    }, [searchParams, page]);

    return (
        <div className="min-h-screen bg-[#F5F5F4] flex flex-col font-sans relative isolate">
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none -z-10 overflow-hidden">
                <div
                    className="w-[1000px] h-[1000px] md:w-[2000px] md:h-[2000px] bg-no-repeat bg-center bg-contain opacity-[1]"
                    style={{ backgroundImage: `url('${BACKGROUND_IMAGE}')` }}
                >
                </div>
            </div>
            <Suspense fallback={<div className="bg-white h-16 border-b border-stone-200"></div>}>
                <Header />
            </Suspense>

            <main className="container mx-auto px-4 py-6 md:py-8 flex flex-col lg:flex-row gap-6 lg:gap-8 transition-all">

                <MobileFilterButton isOpen={showMobileFilters} onClick={() => setShowMobileFilters(!showMobileFilters)} />

                <aside className={`lg:block lg:w-72 shrink-0 transition-all duration-300 ease-in-out z-20 ${showMobileFilters ? 'block' : 'hidden'}`}>
                    <div className="sticky top-24">
                        <Suspense fallback={<div className="w-full h-96 bg-stone-200 animate-pulse rounded-xl"></div>}>
                            <Sidebar />
                        </Suspense>
                    </div>
                </aside>

                <section className="flex-1 min-w-0">

                    {isAuthenticated && user ? (
                        <>
                            <AuthenticatedBanner
                                user={user}
                                totalBookCount={totalCount}
                                onProfileClick={() => router.push('/profile')}
                            />

                            <QuickActionButtons
                                onBorrowClick={() => setIsBorrowModalOpen(true)}
                                onReturnClick={() => setIsReturnModalOpen(true)}
                            />
                        </>
                    ) : (
                        <GuestBanner />
                    )}

                    <div className="flex flex-col gap-4">
                        <ResultsInfo totalCount={totalCount} />
                        <BookGrid books={books} loading={loading} />
                    </div>

                    {!loading && totalCount > 0 && (
                        <div className="mt-10 flex justify-center pb-8">
                            <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
                        </div>
                    )}
                </section>
            </main>

            <BorrowBookModal
                isOpen={isBorrowModalOpen}
                onClose={() => setIsBorrowModalOpen(false)}
                bookTitle="Hızlı Ödünç İşlemi"
                onSuccess={() => {}}
            />

            <ReturnBookModal
                isOpen={isReturnModalOpen}
                onClose={() => setIsReturnModalOpen(false)}
            />

        </div>
    );
}

export default function Home() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-stone-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-800 rounded-full animate-spin"></div>
            </div>
        }>
            <HomeContent />
        </Suspense>
    );
}