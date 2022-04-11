package cn.twincest.plldb.util;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class FindResultWithCount<T> {

	private long count;

	private List<T> result;

}
